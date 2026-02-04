'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin, Star, Navigation, Map as MapIcon, ChevronRight, LogOut, PlusCircle, Check, Car } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { init } from 'next/dist/compiled/webpack/webpack';
declare global {
  interface Window {
    daum: any;
    kakao: any;
  }
}

const supabase = createClient();

// 커스텀 모찌 캐릭터
const MozziCharacter = ({ level, className = "w-32 h-32" }: { level: number; className?: string }) => {
  const safeLevel = Math.max(1, Math.min(5, Math.round(level || 1)));
  
  const getMozziContent = () => {
    const strokeColor = "#4B2C20"; 
    const BodyPath = "M20 60 Q20 30 50 30 Q80 30 80 60 Q80 80 50 80 Q20 80 20 60";

    const getFill = () => {
      switch (safeLevel) {
        case 1: return "#FFFFFF"; 
        case 2: return "#FFFBEB"; 
        case 3: return "url(#grad3)"; 
        case 4: return "url(#grad4)"; 
        case 5: return "url(#grad5)"; 
        default: return "#FFFFFF";
      }
    };

    return (
      <g>
        <defs>
          <radialGradient id="grad3" cx="50%" cy="40%" r="50%" fx="50%" fy="30%">
            <stop offset="0%" style={{ stopColor: "#FDE047", stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: "#FFFBEB", stopOpacity: 1 }} />
          </radialGradient>
          <radialGradient id="grad4" cx="50%" cy="30%" r="60%" fx="50%" fy="20%">
            <stop offset="0%" style={{ stopColor: "#B45309", stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: "#FFFBEB", stopOpacity: 1 }} />
          </radialGradient>
          <radialGradient id="grad5" cx="50%" cy="30%" r="70%" fx="50%" fy="20%">
            <stop offset="0%" style={{ stopColor: "#451A03", stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: "#78350F", stopOpacity: 1 }} />
          </radialGradient>
        </defs>

        <path d={BodyPath} fill={getFill()} stroke={strokeColor} strokeWidth="1.5" className="transition-all duration-500" />
        <circle cx="32" cy="62" r="4" fill="#FDA4AF" opacity="0.4" />
        <circle cx="68" cy="62" r="4" fill="#FDA4AF" opacity="0.4" />

        {safeLevel <= 3 ? (
          <>
            <circle cx="40" cy="58" r="2.5" fill={strokeColor} />
            <circle cx="60" cy="58" r="2.5" fill={strokeColor} />
            <path d="M47 68 Q50 71 53 68" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          </>
        ) : safeLevel === 4 ? (
          <>
            <path d="M36 58 H44 M56 58 H64" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M46 72 H54" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M72 45 Q76 45 74 52 Q72 52 72 45" fill="#60A5FA" />
          </>
        ) : (
          <>
            <circle cx="40" cy="58" r="3" fill={strokeColor} />
            <circle cx="60" cy="58" r="3" fill={strokeColor} />
            <path d="M34 50 L42 54 M66 50 L58 54" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="50" cy="72" rx="3" ry="5" fill="none" stroke={strokeColor} strokeWidth="2" />
            <path d="M25 45 Q28 45 27 50 Q25 50 25 45" fill="#60A5FA" />
            <path d="M75 55 Q78 55 77 60 Q75 60 75 55" fill="#60A5FA" />
            <path d="M78 40 Q81 40 80 45 Q78 45 78 40" fill="#60A5FA" />
          </>
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {getMozziContent()}
    </svg>
  );
};

// 모찌 상태 설정
interface MozziState {
  label: string;
  color: string;
  bg: string;
  border: string;
  textColor: string;
  level: number;
  desc: string;
}

const MOZZI_STATES: Record<number, MozziState> = {
  1: { label: '모찌가 부드러워요', color: '#D1FAE5', bg: 'bg-emerald-50/80', border: 'border-emerald-100', textColor: 'text-emerald-600', level: 1, desc: '아주 쾌적하고 여유로워요!' },
  2: { label: '모찌가 말랑해요', color: '#BBF7D0', bg: 'bg-green-50/80', border: 'border-green-100', textColor: 'text-green-600', level: 2, desc: '기분 좋게 한산한 상태입니다.' },
  3: { label: '모찌가 구워지고 있어요', color: '#FDE047', bg: 'bg-yellow-50/80', border: 'border-yellow-200', textColor: 'text-yellow-700', level: 3, desc: '사람들이 적당히 활기차요.' },
  4: { label: '모찌가 익고 있어요', color: '#F59E0B', bg: 'bg-orange-50/80', border: 'border-orange-200', textColor: 'text-orange-700', level: 4, desc: '북적북적! 조금씩 붐비고 있어요.' },
  5: { label: '모찌가 타고 있어요', color: '#EF4444', bg: 'bg-red-50/80', border: 'border-red-200', textColor: 'text-red-700', level: 5, desc: '사람이 너무 많아요! 다른 곳은 어때요?' },
};

interface ParkingState {
  label: string;
  textColor: string;
}

const PARKING_STATES: Record<number, ParkingState> = {
  1: { label: '주차장 텅텅', textColor: 'text-emerald-600' },
  2: { label: '주차 여유', textColor: 'text-green-600' },
  3: { label: '주차 보통', textColor: 'text-yellow-600' },
  4: { label: '주차 혼잡', textColor: 'text-orange-600' },
  5: { label: '주차 만차', textColor: 'text-red-600' },
};

interface Location {
  id: string;
  name: string;
  latitude: number;  // lat 대신 latitude로 되어 있으므로 함께 수정
  longitude: number; // lng 대신 longitude로 되어 있으므로 함께 수정
  userScore?: number;
  parkingScore?: number;
  dist?: string;
  // 아래 두 줄을 추가합니다
  crowd_sum?: number; 
  crowd_count?: number;
  parking_sum?: number;   
  parking_count?: number;
}

interface Report {
  location_id: string;
  type: 'crowd' | 'parking';
  score: number;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedId, setSelectedId] = useState('1');
  const [userReported, setUserReported] = useState(false);
  const [parkingReported, setParkingReported] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'app'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [newPlace, setNewPlace] = useState({ name: '', lat: '', lng: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false); //

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  const selectedLocation = useMemo(() => {
    return locations.find(l => l.id === selectedId) || locations[0] || null;
  }, [locations, selectedId]
);

  // App 컴포넌트 내 최상단 배치
const fetchLocationsAndReports = async () => {
  // 1. 최신 장소 데이터 가져오기
  const { data: locationsData, error: locError } = await supabase
    .from('locations')
    .select('*');

  if (locError) {
    console.error('데이터 로딩 실패:', locError);
    return;
  };

  // 2. 점수 계산 (혼잡도와 주차를 확실히 분리!)
  const locsWithScores = locationsData.map(loc => {
    // [혼잡도 계산] crowd_sum과 crowd_count 사용
    const avgCrowd = loc.crowd_count && loc.crowd_count > 0 
      ? loc.crowd_sum / loc.crowd_count 
      : 1.0;

    // [주차장 계산] parking_sum과 parking_count 사용
    const avgParking = loc.parking_count && loc.parking_count > 0 
      ? loc.parking_sum / loc.parking_count 
      : 1.0;

    return {
      ...loc,
      userScore: avgCrowd,      // 혼잡도 모찌용
      parkingScore: avgParking, // 주차장 모찌/숫자용
    };
  });

  setLocations(locsWithScores);
};

  // 인증 초기화
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsAnonymous(!session?.user);
      if (session?.user) {
        setAuthView('app');
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAnonymous(!session?.user);
      if (session?.user) {
        setAuthView('app');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // No-op here; auth init runs above.
  }, []);



  const handleSearchAddress = () => {
  // 1. 서비스 사용 가능한지 체크
    if (!window.daum || !window.kakao || !window.kakao.maps) {
      alert("지도 서비스 로딩 중입니다. 잠시만 기다려주세요!");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data: any) {
        const fullAddress = data.address; 
      
      // 2. 카카오 맵 SDK가 완전히 로드된 후 Geocoder 사용
        window.kakao.maps.load(() => {
          const geocoder = new window.kakao.maps.services.Geocoder();
        
          geocoder.addressSearch(fullAddress, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
            // 성공 시 상태 업데이트
              setNewPlace((prev) => ({
                ...prev,
                name: data.buildingName || fullAddress,
                lat: result[0].y,
                lng: result[0].x
              }));
            } else {
              alert("좌표를 불러오는 데 실패했습니다.");
            }
          });
        });
      }
    }).open();
  };

  
  useEffect(() => {
    if (typeof window === 'undefined') return;

  // 1. 주소 검색(Postcode) 스크립트 로드
    if (!document.getElementById('daum-postcode')) {
      const postcodeScript = document.createElement('script');
      postcodeScript.id = 'daum-postcode';
      postcodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      postcodeScript.async = true;
      document.head.appendChild(postcodeScript);
    }

  // 2. 카카오 맵 SDK 로드 (자동 로드 끄기)
    if (!document.getElementById('kakao-maps-sdk')) {
      const kakaoScript = document.createElement('script');
      kakaoScript.id = 'kakao-maps-sdk';
      kakaoScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=13e79714db6e931bf4b822cb209c27a5&libraries=services&autoload=false`;
      kakaoScript.async = true;
    
      kakaoScript.onload = () => {
      // SDK 파일 자체가 로드된 후, 내부 모듈들을 로드함
        window.kakao.maps.load(() => {
          console.log('✅ 카카오 맵 서비스 로드 완료');
          setIsKakaoLoaded(true);
        });
      };
      document.head.appendChild(kakaoScript);
    }
  }, []);

  // 장소 및 리포트 데이터 실시간 구독
  useEffect(() => {

    fetchLocationsAndReports();

    // 실시간 구독 설정
    const locationsChannel = supabase
      .channel('locations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, fetchLocationsAndReports)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, fetchLocationsAndReports)
      .subscribe();

    return () => {
      supabase.removeChannel(locationsChannel);
    };
  }, []);

  // 지도 로딩
  useEffect(() => {
    if (activeTab === 'map') {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setIsMapLoaded(true);
        document.head.appendChild(script);
      } else if (typeof window !== 'undefined' && (window as any).L) {
        setIsMapLoaded(true);
      }
    }
  }, [activeTab]);

  const initMap = React.useCallback(() => {
    if (!mapContainerRef.current || !(window as any).L) return;

  // 기존 지도 있으면 삭제
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const L = (window as any).L;
  // 초기 위치는 고정값이나 현재 위치로 설정
    const map = L.map(mapContainerRef.current, { zoomControl: false })
      .setView([selectedLocation?.latitude || 33.39, selectedLocation?.longitude || 126.23], 12);
  
    mapInstance.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // 마커 뿌리기
    locations.forEach(loc => {
      const score = loc.userScore || 1;
      const state = MOZZI_STATES[Math.round(score)] || MOZZI_STATES[1];
      L.circleMarker([loc.latitude, loc.longitude], {
        radius: 14, fillColor: state.color, color: '#064E3B', weight: 2, fillOpacity: 0.9
      }).addTo(map).on('click', () => {
        setSelectedId(loc.id); // 클릭 시 ID만 변경 (지도는 안 지워짐)
      });
    });

    setTimeout(() => map.invalidateSize(), 200);
  }, [isMapLoaded, locations]); // 여기서 selectedLocation을 빼야 마커 클릭 시 지도가 안 사라짐！

  // 지도 렌더링
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'map' && isMapLoaded) {
      timer = setTimeout(initMap, 100);
    }
    return () => {
      clearTimeout(timer);
      if (mapInstance.current) { 
        mapInstance.current.remove(); 
        mapInstance.current = null; 
      }
    };
  }, [activeTab, isMapLoaded, initMap]);

  const handleRating = async (score: number) => {
  if (isAnonymous) { 
    setAuthError("회원가입 후 제보가 가능합니다. 🌿"); 
    return; 
  }
  setUserReported(true);
  
  try {
    const currentId = selectedLocation.id; // 1. 현재 장소 ID 미리 저장

    // 2. reports 제보 추가 (text 타입 변환 및 제약 조건 준수)
    await supabase.from('reports').insert({
      location_id: currentId,
      congestion_level: score.toString(), 
      parking_level: "1", // DB 제약 조건(1~5) 통과를 위해 1로 설정
      comment: ""
    });

    // 3. locations 합계 업데이트
    await supabase.from('locations').update({
      crowd_sum: (selectedLocation.crowd_sum || 0) + score,
      crowd_count: (selectedLocation.crowd_count || 0) + 1
    }).eq('id', currentId);

    // 4. 데이터 갱신 후 장소 고정!
    await fetchLocationsAndReports();
    setSelectedId(currentId); // ★ 이 줄이 있어야 장소가 안 바뀝니다

  } catch (err) { 
    console.error("제보 실패:", err); 
  }
  
  setTimeout(() => setUserReported(false), 2000);
};

  const handleParkingRating = async (score: number) => {
  if (isAnonymous) { 
    setAuthError("회원가입 후 주차 제보가 가능합니다. 🚗"); 
    return; 
  }
  setParkingReported(true);
  
  try {
    const currentId = selectedLocation.id;

    // 1. reports 테이블에 데이터 추가
    const { error: reportError } = await supabase.from('reports').insert({
      location_id: currentId,
      parking_level: String(score),      // 점수를 문자열로 변환
      congestion_level: "1",             // 기본값으로 1 설정
      comment: "주차 제보"                 //
    });

    if (reportError) {
      console.error("SQL 명령을 먼저 실행해야 이 에러가 사라집니다!:", reportError.message);
      throw reportError;
    }

    // 2. locations 테이블 실시간 점수 합산 업데이트
    const { error: updateError } = await supabase
      .from('locations')
      .update({
        parking_sum: (selectedLocation.parking_sum || 0) + score,
        parking_count: (selectedLocation.parking_count || 0) + 1
      })
      .eq('id', currentId);

    if (updateError) throw updateError;

    // 3. 화면 데이터 즉시 갱신
    await fetchLocationsAndReports();

  } catch (err) { 
    console.error("주차 제보 최종 실패:", err); 
  }
  
  setTimeout(() => setParkingReported(false), 2000);
};

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlace.name || !newPlace.lat || !newPlace.lng) return;
    setIsAdding(true);
    
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          name: newPlace.name,
          latitude: parseFloat(newPlace.lat),
          longitude: parseFloat(newPlace.lng),
          dist: 'N/A',
          address: '',
          category: '관광',
          crowd_sum: 0,
          crowd_count: 0,
          parking_sum: 0,
          parking_count: 0
          
        })
        .select()
        .single();

      if (error) throw error;

      setNewPlace({ name: '', lat: '', lng: '' });
      setSelectedId(data.id);
      setActiveTab('home');
    } catch (err:any) {
      console.error("장소 추가 실패 상세:", err.message, err.details, err.hint);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authView === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setAuthError('가입 확인 이메일을 보냈습니다!');
      }
    } catch (err: any) { 
      setAuthError(err.message || "인증 정보를 확인해주세요."); 
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const totalScore = selectedLocation?.userScore || 1;
  const currentMozzi = MOZZI_STATES[Math.round(totalScore)] || MOZZI_STATES[1];
  const parkingScore = selectedLocation?.parkingScore || 1;
  const currentParking = PARKING_STATES[Math.round(parkingScore)] || PARKING_STATES[1];

  const recommendations = useMemo(() => {
    return locations
      .filter(l => l.id !== selectedId && (l.userScore || 1) < 3.5)
      .slice(0, 2);
  }, [locations, selectedId]);

  if (!user && authView !== 'app') {
    return (
      <div className="flex flex-col h-screen bg-white text-gray-900 font-sans max-w-md mx-auto p-10 justify-center items-center text-left">
        <div className="w-full space-y-10">
          <div className="text-center">
            <MozziCharacter level={2} className="w-40 h-40 mx-auto drop-shadow-md" />
            <h1 className="text-4xl font-black text-green-600 mt-5 tracking-tighter">모찌체크</h1>
            <p className="text-gray-400 font-black text-[10px] mt-2 uppercase tracking-widest underline decoration-green-200">User Based Live Guide</p>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-3">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-400 outline-none transition-all" 
                placeholder="이메일 주소" 
                required 
              />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-400 outline-none transition-all" 
                placeholder="비밀번호" 
                required 
              />
            </div>
            {authError && <p className="text-red-500 text-[10px] font-bold px-1">{authError}</p>}
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-600/20 active:scale-95 transition-all uppercase tracking-widest text-sm mt-2"
            >
              {authView === 'login' ? 'Login' : 'Join Now'}
            </button>
          </form>
          <div className="text-center space-y-3">
            <button 
              onClick={() => { setAuthView(authView === 'login' ? 'signup' : 'login'); setAuthError(''); }} 
              className="text-xs font-bold text-gray-400 underline decoration-green-100 underline-offset-4"
            >
              {authView === 'login' ? '아직 회원이 아니신가요? 가입하기' : '이미 계정이 있어요! 로그인하기'}
            </button>
            <div className="pt-2">
              <button 
                onClick={() => setAuthView('app')} 
                className="text-xs font-bold text-gray-500 hover:text-green-600 transition-colors"
              >
                둘러보기 (제보 기능 제한)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative text-left border-x border-gray-100">
      <header className="p-4 bg-white border-b border-gray-100 shrink-0 z-50 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-left">
             <h1 className="text-2xl font-black text-green-600 tracking-tighter">모찌체크</h1>
             <p className="text-[9px] text-gray-400 font-black uppercase leading-none tracking-widest">
               {isAnonymous ? '둘러보기 모드' : user?.email?.split('@')[0] || '사용자'}
             </p>
          </div>
          <button 
            onClick={handleSignOut} 
            className="text-gray-300 hover:text-green-600 transition-colors p-1"
          >
            <LogOut size={20} />
          </button>
        </div>
        {activeTab !== 'add' && (
          <div className="relative">
            <input 
              type="text" 
              placeholder="어디가 궁금하신가요?"
              className="w-full bg-gray-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={18} />
            {searchQuery && (
              <div className="absolute top-16 left-0 right-0 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-[60] max-h-60 overflow-y-auto">
                {locations.filter(l => l.name.includes(searchQuery)).map(loc => (
                  <button 
                    key={loc.id} 
                    className="w-full p-4 text-left hover:bg-emerald-50 flex items-center justify-between border-b border-gray-50 last:border-none transition-colors"
                    onClick={() => { setSelectedId(loc.id); setSearchQuery(''); setActiveTab('home'); }}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin size={16} className="text-gray-400" /> 
                      <span className="font-bold text-sm tracking-tight text-gray-700">{loc.name}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'home' ? (
          <main className="h-full overflow-y-auto p-5 space-y-6 bg-gray-50/30">
            {/* 메인 캐릭터 카드 */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-green-900/5 border border-white relative overflow-hidden text-center transition-all">
              <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: currentMozzi.color }}></div>
              <div className="relative z-10">
                <div className="mb-4">
                  <MozziCharacter level={totalScore} className="w-48 h-48 mx-auto drop-shadow-sm transition-transform duration-500 hover:scale-105" />
                </div>
                <h2 className="text-lg font-bold text-gray-400 mb-1 flex items-center justify-center">
                  <Navigation size={14} className="mr-1" /> {selectedLocation?.name}
                </h2>
                <div className={`text-2xl font-black ${currentMozzi.textColor} mb-3 tracking-tighter leading-tight`}>
                  {currentMozzi.label}
                </div>
                
                {/* 주차 상태 표시 배지 */}
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full bg-gray-50 border border-gray-100 flex items-center gap-1 ${currentParking.textColor}`}>
                    <Car size={12} /> {currentParking.label} ({parkingScore.toFixed(1)})
                  </span>
                </div>

                <p className="text-gray-500 text-[11px] font-medium bg-gray-50 px-5 py-2.5 rounded-full inline-block border border-gray-100 mt-4">
                  {currentMozzi.desc}
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <div className={`px-10 py-4 rounded-3xl border transition-all duration-500 text-center ${currentMozzi.bg} ${currentMozzi.border}`}>
                  <p className={`text-[9px] font-black uppercase mb-1 tracking-widest leading-none ${currentMozzi.textColor}`}>
                    Live Average
                  </p>
                  <p className={`text-2xl font-black ${currentMozzi.textColor}`}>
                    {totalScore.toFixed(2)}
                  </p>
                </div>
              </div>
            </section>

            {/* 제보 섹션 */}
            <section className="space-y-6 text-left px-1">
              {/* 혼잡도 제보 */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <h3 className="text-sm font-black text-gray-800 tracking-tight">이 장소의 실제 상태는?</h3>
                  {userReported && (
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-green-600 animate-fadeIn">
                      <Check size={12} /> <span>제보 완료!</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(score => {
                    const state = MOZZI_STATES[score];
                    return (
                      <button
                        key={score}
                        onClick={() => handleRating(score)}
                        disabled={userReported}
                        className={`aspect-square rounded-2xl border-2 transition-all active:scale-95 hover:scale-105 ${state.border} ${state.bg} ${userReported ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center justify-center h-full p-1">
                          <MozziCharacter level={score} className="w-12 h-12" />
                          <span className={`text-[9px] font-black mt-1 ${state.textColor}`}>{score}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 주차 제보 */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <h3 className="text-sm font-black text-gray-800 tracking-tight flex items-center gap-1">
                    <Car size={14} /> 주차장 상태는?
                  </h3>
                  {parkingReported && (
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-green-600 animate-fadeIn">
                      <Check size={12} /> <span>제보 완료!</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(score => {
                    const parkState = PARKING_STATES[score];
                    const mozState = MOZZI_STATES[score];
                    return (
                      <button
                        key={score}
                        onClick={() => handleParkingRating(score)}
                        disabled={parkingReported}
                        className={`p-3 rounded-2xl border-2 transition-all active:scale-95 hover:scale-105 ${mozState.border} ${mozState.bg} ${parkingReported ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <Car size={20} className={parkState.textColor} />
                          <span className={`text-[9px] font-black ${parkState.textColor}`}>{score}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {authError && (
                <div className="text-center text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-2xl py-3 px-4">
                  {authError}
                </div>
              )}
            </section>

            {/* 추천 장소 */}
            {recommendations.length > 0 && (
              <section className="space-y-3 px-1">
                <h3 className="text-sm font-black text-gray-800 tracking-tight flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" /> 여유로운 곳 추천
                </h3>
                <div className="space-y-2">
                  {recommendations.map(rec => (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedId(rec.id)}
                      className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-200 transition-all flex items-center justify-between group hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <MozziCharacter level={rec.userScore || 1} className="w-12 h-12" />
                        <div className="text-left">
                          <p className="font-bold text-sm text-gray-700">{rec.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{rec.dist}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </main>
        ) : activeTab === 'map' ? (
          <div className="h-full relative">
            <div ref={mapContainerRef} className="w-full h-full" />
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 font-bold">지도 로딩 중...</p>
              </div>
            )}
            {selectedLocation && (
              <div className="absolute bottom-6 left-4 right-4 bg-white rounded-3xl p-5 shadow-2xl z-[1000] flex items-center justify-between animate-slideUp">
                <div className="flex items-center space-x-4">
                  <MozziCharacter level={selectedLocation.userScore || 1} className="w-16 h-16" />
                  <div className="text-left">
                    <h4 className="font-black text-gray-800 text-lg">{selectedLocation.name}</h4>
                    <p className="text-xs font-bold text-green-600">현재 {MOZZI_STATES[Math.round(selectedLocation.userScore || 1)].label}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('home')} // 홈 탭으로 가서 상세 제보하기
                  className="bg-gray-100 p-3 rounded-2xl hover:bg-green-50 transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
               </div>
            )}
          </div>
        ) : activeTab === 'add' ? (
          <div className="h-full overflow-y-auto p-6 bg-white">
            <h2 className="text-xl font-black text-gray-800 mb-6">새 장소 추가하기</h2>
            <form onSubmit={handleAddPlace} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">장소 이름</label>
                <input
                  type="text"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="예: 성산 일출봉"
                  required
                />
              </div>
              {/* 600번 라인 근처, 장소 이름 입력창 바로 아래에 삽입 */}
              <div className="space-y-4">
                <button 
                  type="button"
                  onClick={handleSearchAddress}
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Search size={18} /> 주소 검색으로 위치 찾기
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <label className="text-[10px] font-black text-gray-400 uppercase">위도(LAT)</label>
                    <p className="text-sm font-bold text-gray-600">{newPlace.lat || '0.0000'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <label className="text-[10px] font-black text-gray-400 uppercase">경도(LNG)</label>
                    <p className="text-sm font-bold text-gray-600">{newPlace.lng || '0.0000'}</p>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isAdding ? '추가 중...' : '장소 추가'}
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {/* 하단 네비게이션 */}
      <nav className="bg-white border-t border-gray-100 shrink-0 shadow-2xl z-50">
        <div className="flex justify-around items-center py-3">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 px-6 py-2 rounded-2xl transition-all ${
              activeTab === 'home' ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <Navigation size={20} />
            <span className="text-[10px] font-black uppercase tracking-wide">홈</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center space-y-1 px-6 py-2 rounded-2xl transition-all ${
              activeTab === 'map' ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <MapIcon size={20} />
            <span className="text-[10px] font-black uppercase tracking-wide">지도</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex flex-col items-center space-y-1 px-6 py-2 rounded-2xl transition-all ${
              activeTab === 'add' ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <PlusCircle size={20} />
            <span className="text-[10px] font-black uppercase tracking-wide">추가</span>
          </button>
        </div>
      </nav>
    </div>
  );
}