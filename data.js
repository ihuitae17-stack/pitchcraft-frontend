// Product Data (Locker - Market)
const products = [
    { name: "미즈노 프로 하가 기성", brand: "Mizuno", position: "투수", hand: "우투", price: "450,000", img: "https://images.unsplash.com/photo-1546255799-270836c28f09?w=600&q=80", grade: "A급", desc: "실사 3회, 길각 완벽합니다. 문의 주세요!", seller: { name: "정현", trust: 99.9, badge: true } },
    { name: "윌슨 A2000 1786", brand: "Wilson", position: "내야수", hand: "우투", price: "180,000", img: "https://images.unsplash.com/photo-1563205085-f2cf8d070659?w=600&q=80", grade: "B급", desc: "바닥 보정 완료, 즉시 실사 가능합니다.", seller: { name: "야구광", trust: 88.5, badge: false } },
    { name: "제트 프로스테이터스", brand: "ZETT", position: "포수", hand: "우투", price: "520,000", img: "https://images.unsplash.com/photo-1599580628285-a7ae89e2526e?w=600&q=80", grade: "S급", desc: "택만 뗀 새상품입니다. 박스 포함.", seller: { name: "캐처", trust: 95.0, badge: true } },
    { name: "롤링스 HOH R2G", brand: "Rawlings", position: "투수", hand: "좌투", price: "210,000", img: "https://images.unsplash.com/photo-1546255799-270836c28f09?w=600&q=80", grade: "A급", desc: "좌투용! 가볍고 잘 잡힙니다.", seller: { name: "사우스포", trust: 92.3, badge: true } },
    { name: "하타케야마 포수미트", brand: "Hatakeyama", position: "포수", hand: "우투", price: "380,000", img: "https://images.unsplash.com/photo-1599580628285-a7ae89e2526e?w=600&q=80", grade: "A급", desc: "일본 직구, 길각 완료 상태 좋습니다.", seller: { name: "안방마님", trust: 85.0, badge: false } },
    { name: "SSK 사이드암 투수용", brand: "SSK", position: "투수", hand: "우투", price: "290,000", img: "https://images.unsplash.com/photo-1546255799-270836c28f09?w=600&q=80", grade: "B급", desc: "사이드암 투수에게 딱! 그물망 타입.", seller: { name: "잠수함", trust: 90.0, badge: true } },
    { name: "이스턴 고스트 배트", brand: "Easton", position: "배트", hand: "공용", price: "150,000", img: "https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?w=600&q=80", grade: "B급", desc: "33-28, 덴트 없고 웨이브 없습니다.", seller: { name: "거포", trust: 82.0, badge: false } },
    { name: "마루치 CAT9 -3", brand: "Marucci", position: "배트", hand: "공용", price: "280,000", img: "https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?w=600&q=80", grade: "A급", desc: "거의 새것, 배팅장에서만 사용함.", seller: { name: "똑딱이", trust: 98.0, badge: true } },
    { name: "미즈노 프랜차이즈 스파이크", brand: "Mizuno", position: "신발", hand: "공용", price: "85,000", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", grade: "B급", desc: "270mm, 상태 양호합니다.", seller: { name: "대주자", trust: 91.5, badge: true } },
    { name: "뉴발란스 야구화 4040v6", brand: "New Balance", position: "신발", hand: "공용", price: "120,000", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", grade: "A급", desc: "280mm, 2번 착용. 거의 새것.", seller: { name: "전력질주", trust: 96.2, badge: true } },
];


// Price Comparison Data (Locker - Top)
const priceComparisons = [
    { name: "윌슨 A2000 1786 (새상품)", mall: "야구랜드", price: "289,000", sale: "10%", link: "#", img: "https://images.unsplash.com/photo-1563205085-f2cf8d070659?w=200&q=80" },
    { name: "모리모토 1등급 투수", mall: "짱베이스볼", price: "159,000", sale: "30%", link: "#", img: "https://images.unsplash.com/photo-1546255799-270836c28f09?w=200&q=80" },
    { name: "사회인 야구 배트 05", mall: "FSK몰", price: "120,000", sale: "15%", link: "#", img: "https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?w=200&q=80" },
];

// Anatomy / Q&A Data (Ground - Q&A)
const questions = [
    { title: "포수 미트 입문용 추천좀요 ㅠㅠ", tag: "질문", comments: 5, views: 120, time: "방금" },
    { title: "30만원대 투수 글러브 뭐가 좋나요?", tag: "질문", comments: 12, views: 340, time: "1시간 전" },
    { title: "사회인 야구 배트 규정 질문", tag: "정보", comments: 3, views: 80, time: "3시간 전" },
    { title: "오더 글러브 제작 기간 보통 얼마나 걸림?", tag: "잡담", comments: 8, views: 200, time: "어제" },
];

// Lesson Data (Locker - Bottom)
const lessons = [
    { name: "최동원 스타일 강속구 레슨", coach: "박투수 (전 롯데)", loc: "부산 사직", price: "70,000", rating: "5.0", img: "https://images.unsplash.com/photo-1554522851-2db7ad92b3a9?w=200&q=80", tags: ["투수", "속구", "변화구"] },
    { name: "사회인 내야수 수비 마스터", coach: "김내야 (선출)", loc: "서울 잠실", price: "50,000", rating: "4.8", img: "https://images.unsplash.com/photo-1562916120-1b7725916d1f?w=200&q=80", tags: ["내야", "수비", "풋워크"] },
    { name: "홈런 타구 만드는 타격 메커니즘", coach: "이타자 (전 삼성)", loc: "대구 수성", price: "65,000", rating: "4.9", img: "https://images.unsplash.com/photo-1627632669460-d6c52a6d7139?w=200&q=80", tags: ["타격", "장타", "티배팅"] },
];

// User Growth Data (My Craft)
let growthData = [
    { label: '1주차', value: 118, percent: 40, latest: false },
    { label: '2주차', value: 120, percent: 50, latest: false },
    { label: '3주차', value: 122, percent: 55, latest: false },
    { label: '4주차', value: 125, percent: 70, latest: false },
    { label: '이번주', value: 128, percent: 90, latest: true }
];
let currentMaxSpeed = 128;
