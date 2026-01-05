// PitchCraft API Configuration
// 백엔드 서버 연결 설정

const API_CONFIG = {
    // 환경에 따라 URL 자동 선택
    // localhost에서 실행 시 Docker 백엔드 사용, 그 외에는 Render 배포 서버
    BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8000'
        : 'https://pitchcraft-backend-mll9.onrender.com',

    // API 버전
    VERSION: 'v1',

    // 전체 API URL
    get API_URL() {
        return `${this.BASE_URL}/api/${this.VERSION}`;
    },

    // 엔드포인트
    ENDPOINTS: {
        // 인증
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login',
        },
        // 사용자
        USERS: {
            ME: '/users/me',
        },
        // 영상
        VIDEOS: {
            UPLOAD_REQUEST: '/videos/upload-request',
            LIST: '/videos',
        },
        // 분석
        ANALYSES: {
            REQUEST: '/analyses',
            LIST: '/analyses',
        },
        // 헬스체크
        HEALTH: '/health',
        TEST: '/test',
    }
};

// API 호출 헬퍼 함수
class PitchCraftAPI {
    constructor() {
        this.baseUrl = API_CONFIG.API_URL;
        this.token = localStorage.getItem('pitchcraft_token');
    }

    // 헤더 생성
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // 토큰 저장
    setToken(token) {
        this.token = token;
        localStorage.setItem('pitchcraft_token', token);
    }

    // 토큰 삭제
    clearToken() {
        this.token = null;
        localStorage.removeItem('pitchcraft_token');
    }

    // 헬스체크
    async healthCheck() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'error', message: error.message };
        }
    }

    // 테스트 API
    async testAPI() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/test`);
            return await response.json();
        } catch (error) {
            console.error('API test failed:', error);
            return { error: error.message };
        }
    }

    // 회원가입
    async register(email, password, nickname) {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ email, password, nickname })
            });
            return await response.json();
        } catch (error) {
            console.error('Registration failed:', error);
            return { error: error.message };
        }
    }

    // 로그인
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: email, password })
            });
            const data = await response.json();
            if (data.access_token) {
                this.setToken(data.access_token);
            }
            return data;
        } catch (error) {
            console.error('Login failed:', error);
            return { error: error.message };
        }
    }

    // 내 정보 조회
    async getMyProfile() {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.ME}`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Get profile failed:', error);
            return { error: error.message };
        }
    }

    // ========= 영상 업로드 관련 =========

    // 업로드 URL 요청
    async requestUploadUrl(filename, fileSize) {
        try {
            const response = await fetch(
                `${this.baseUrl}${API_CONFIG.ENDPOINTS.VIDEOS.UPLOAD_REQUEST}?filename=${encodeURIComponent(filename)}&file_size=${fileSize}`,
                {
                    method: 'POST',
                    headers: this.getHeaders()
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Upload URL request failed:', error);
            return { error: error.message };
        }
    }

    // Presigned URL로 영상 업로드 (MinIO/S3 직접 업로드)
    async uploadToPresignedUrl(presignedUrl, file, onProgress) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', presignedUrl, true);
            xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');

            if (onProgress) {
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        onProgress(Math.round((e.loaded / e.total) * 100));
                    }
                };
            }

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({ success: true });
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            };
            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.send(file);
        });
    }

    // 업로드 완료 확인
    async confirmUpload(videoId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/videos/${videoId}/upload-complete`,
                {
                    method: 'POST',
                    headers: this.getHeaders()
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Confirm upload failed:', error);
            return { error: error.message };
        }
    }

    // ========= 분석 관련 =========

    // 분석 요청
    async requestAnalysis(videoId) {
        try {
            const response = await fetch(
                `${this.baseUrl}${API_CONFIG.ENDPOINTS.ANALYSES.REQUEST}`,
                {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: JSON.stringify({ video_id: videoId })
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Analysis request failed:', error);
            return { error: error.message };
        }
    }

    // 분석 결과 조회
    async getAnalysisResult(analysisId) {
        try {
            const response = await fetch(
                `${this.baseUrl}${API_CONFIG.ENDPOINTS.ANALYSES.REQUEST}/${analysisId}`,
                {
                    headers: this.getHeaders()
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Get analysis result failed:', error);
            return { error: error.message };
        }
    }

    // 분석 결과 폴링 (완료될 때까지 대기)
    async pollAnalysisResult(analysisId, intervalMs = 2000, maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            const result = await this.getAnalysisResult(analysisId);
            if (result.efficiency_score !== null && result.efficiency_score !== undefined) {
                return result; // 분석 완료
            }
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
        return { error: 'Analysis timeout - still processing' };
    }
}

// 전역 API 인스턴스
const pitchcraftAPI = new PitchCraftAPI();

// 서버 상태 확인 함수 (페이지 로드 시 호출)
async function checkServerStatus() {
    const status = await pitchcraftAPI.healthCheck();
    if (status.status === 'healthy') {
        console.log('🚀 PitchCraft Backend Connected!');
        return true;
    } else {
        console.warn('⚠️ Backend server may be sleeping (Render free tier). First request may take ~50 seconds.');
        return false;
    }
}

// 페이지 로드 시 서버 상태 확인
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        checkServerStatus();
    });
}
