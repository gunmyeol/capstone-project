import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { AlertCircle, TrendingUp, MapPin, Clock } from "lucide-react";

// 시계열 데이터 생성 함수
const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    
    data.push({
      time: time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      attacks: Math.floor(Math.random() * 50) + 10,
      traffic: Math.floor(Math.random() * 1000) + 500,
      threatLevel: Math.floor(Math.random() * 100),
    });
  }
  
  return data;
};

// 공격 위치 데이터 생성 함수
const generateGeoData = () => {
  return [
    { country: "China", attacks: 245, lat: 35.8617, lng: 104.1954 },
    { country: "Russia", attacks: 189, lat: 61.524, lng: 105.3188 },
    { country: "USA", attacks: 156, lat: 37.0902, lng: -95.7129 },
    { country: "India", attacks: 134, lat: 20.5937, lng: 78.9629 },
    { country: "Brazil", attacks: 98, lat: -14.2350, lng: -51.9253 },
    { country: "Japan", attacks: 87, lat: 36.2048, lng: 138.2529 },
    { country: "Germany", attacks: 76, lat: 51.1657, lng: 10.4515 },
    { country: "France", attacks: 65, lat: 46.2276, lng: 2.2137 },
  ];
};

// 공격 유형별 통계
const generateAttackTypeData = () => {
  return [
    { type: "DDoS", count: 245, percentage: 35 },
    { type: "Port Scanning", count: 156, percentage: 22 },
    { type: "SQL Injection", count: 134, percentage: 19 },
    { type: "Brute Force", count: 98, percentage: 14 },
    { type: "DoS", count: 67, percentage: 10 },
  ];
};

export default function Monitoring() {
  const { user, isAuthenticated } = useAuth();
  const [timeSeriesData] = useState(generateTimeSeriesData());
  const [geoData] = useState(generateGeoData());
  const [attackTypeData] = useState(generateAttackTypeData());
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-black mb-8 leading-none">로그인 필요</h1>
          <p className="text-2xl font-bold mb-8">실시간 모니터링을 사용하려면 로그인하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="border-b-4 border-black p-8 mb-12">
        <h1 className="text-8xl font-black mb-4 leading-none">실시간 모니터링</h1>
        <p className="text-2xl font-bold">네트워크 침입 탐지 대시보드</p>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="px-8 max-w-7xl mx-auto">
        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          <Card className="border-4 border-black p-8">
            <div className="text-6xl font-black mb-4">1,245</div>
            <div className="text-xl font-bold">총 탐지된 공격</div>
          </Card>
          <Card className="border-4 border-black p-8">
            <div className="text-6xl font-black mb-4">98.76%</div>
            <div className="text-xl font-bold">탐지 정확도</div>
          </Card>
          <Card className="border-4 border-black p-8">
            <div className="text-6xl font-black mb-4">12.3ms</div>
            <div className="text-xl font-bold">평균 응답 시간</div>
          </Card>
          <Card className="border-4 border-black p-8">
            <div className="text-6xl font-black mb-4">8</div>
            <div className="text-xl font-bold">활성 모델</div>
          </Card>
        </div>

        {/* 시계열 차트 섹션 */}
        <div className="mb-12">
          <div className="border-b-4 border-black mb-8 pb-4">
            <h2 className="text-5xl font-black flex items-center gap-4">
              <Clock className="w-12 h-12" />
              시간대별 공격 탐지
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* 공격 탐지 수 시계열 */}
            <Card className="border-4 border-black p-8">
              <h3 className="text-2xl font-bold mb-6">시간대별 탐지 수</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="0" stroke="black" strokeWidth={2} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fontWeight: 'bold' }}
                    stroke="black"
                    strokeWidth={2}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fontWeight: 'bold' }}
                    stroke="black"
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '3px solid black',
                      borderRadius: 0
                    }}
                    cursor={{ stroke: 'black', strokeWidth: 2 }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                  <Line 
                    type="monotone" 
                    dataKey="attacks" 
                    stroke="black" 
                    strokeWidth={3}
                    dot={{ fill: 'black', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="탐지된 공격"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* 위협 수준 시계열 */}
            <Card className="border-4 border-black p-8">
              <h3 className="text-2xl font-bold mb-6">시간대별 위협 수준</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="0" stroke="black" strokeWidth={2} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fontWeight: 'bold' }}
                    stroke="black"
                    strokeWidth={2}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fontWeight: 'bold' }}
                    stroke="black"
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '3px solid black',
                      borderRadius: 0
                    }}
                    cursor={{ stroke: 'black', strokeWidth: 2 }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                  <Area 
                    type="monotone" 
                    dataKey="threatLevel" 
                    stroke="black" 
                    fill="black"
                    strokeWidth={3}
                    name="위협 수준"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* 지도 시각화 섹션 */}
        <div className="mb-12">
          <div className="border-b-4 border-black mb-8 pb-4">
            <h2 className="text-5xl font-black flex items-center gap-4">
              <MapPin className="w-12 h-12" />
              지역별 공격 분포
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* 공격 출발지 지도 */}
            <Card className="col-span-2 border-4 border-black p-8">
              <h3 className="text-2xl font-bold mb-6">공격 출발지 분포</h3>
              <div className="bg-gray-100 border-4 border-black p-8 rounded-none">
                <div className="text-center text-gray-600 font-bold">
                  <div className="text-6xl mb-4">🌍</div>
                  <p>Google Maps 통합 - 공격 출발지 실시간 시각화</p>
                  <p className="text-sm mt-4">위도/경도 기반 공격 위치 표시</p>
                </div>
              </div>
            </Card>

            {/* 국가별 공격 통계 */}
            <Card className="border-4 border-black p-8">
              <h3 className="text-2xl font-bold mb-6">상위 공격 국가</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {geoData.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedCountry(item.country)}
                    className={`p-4 border-2 border-black cursor-pointer transition ${
                      selectedCountry === item.country 
                        ? 'bg-black text-white' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{item.country}</span>
                      <span className="text-lg font-black">{item.attacks}</span>
                    </div>
                    <div className="w-full bg-gray-300 h-2 border border-black">
                      <div 
                        className="bg-black h-full" 
                        style={{ width: `${(item.attacks / 245) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 공격 유형별 분석 */}
        <div className="mb-12">
          <div className="border-b-4 border-black mb-8 pb-4">
            <h2 className="text-5xl font-black flex items-center gap-4">
              <TrendingUp className="w-12 h-12" />
              공격 유형별 분석
            </h2>
          </div>

          <Card className="border-4 border-black p-8">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={attackTypeData}>
                <CartesianGrid strokeDasharray="0" stroke="black" strokeWidth={2} />
                <XAxis 
                  dataKey="type" 
                  tick={{ fontSize: 12, fontWeight: 'bold' }}
                  stroke="black"
                  strokeWidth={2}
                />
                <YAxis 
                  tick={{ fontSize: 12, fontWeight: 'bold' }}
                  stroke="black"
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '3px solid black',
                    borderRadius: 0
                  }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                <Bar 
                  dataKey="count" 
                  fill="black" 
                  stroke="black"
                  strokeWidth={2}
                  name="탐지 수"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 실시간 알림 */}
        <div className="mb-12">
          <div className="border-b-4 border-black mb-8 pb-4">
            <h2 className="text-5xl font-black flex items-center gap-4">
              <AlertCircle className="w-12 h-12" />
              최근 탐지 사항
            </h2>
          </div>

          <Card className="border-4 border-black p-8">
            <div className="space-y-4">
              {[
                { time: "2분 전", type: "DDoS", severity: "CRITICAL", source: "192.168.1.100", target: "10.0.0.1" },
                { time: "5분 전", type: "Port Scanning", severity: "HIGH", source: "203.0.113.45", target: "10.0.0.5" },
                { time: "12분 전", type: "SQL Injection", severity: "HIGH", source: "198.51.100.89", target: "10.0.0.10" },
                { time: "18분 전", type: "Brute Force", severity: "MEDIUM", source: "192.0.2.123", target: "10.0.0.15" },
              ].map((alert, idx) => (
                <div key={idx} className="border-2 border-black p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{alert.type}</div>
                    <div className="text-sm text-gray-600">
                      {alert.source} → {alert.target}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-black text-sm px-3 py-1 border-2 border-black ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                      alert.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {alert.severity}
                    </div>
                    <div className="text-xs font-bold mt-2">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
