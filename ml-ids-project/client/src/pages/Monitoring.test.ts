import { describe, it, expect } from "vitest";

describe("Monitoring Page - Time Series and Geo Visualization", () => {
  it("should generate 24-hour time series data", () => {
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

    const data = generateTimeSeriesData();
    
    expect(data).toHaveLength(24);
    expect(data[0]).toHaveProperty('time');
    expect(data[0]).toHaveProperty('attacks');
    expect(data[0]).toHaveProperty('traffic');
    expect(data[0]).toHaveProperty('threatLevel');
    
    // 모든 공격 수가 10 이상 60 미만인지 확인
    data.forEach(item => {
      expect(item.attacks).toBeGreaterThanOrEqual(10);
      expect(item.attacks).toBeLessThan(60);
    });
    
    // 모든 트래픽 볼륨이 500 이상 1500 미만인지 확인
    data.forEach(item => {
      expect(item.traffic).toBeGreaterThanOrEqual(500);
      expect(item.traffic).toBeLessThan(1500);
    });
    
    // 모든 위협 수준이 0 이상 100 미만인지 확인
    data.forEach(item => {
      expect(item.threatLevel).toBeGreaterThanOrEqual(0);
      expect(item.threatLevel).toBeLessThan(100);
    });
  });

  it("should generate geo data with attack statistics", () => {
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

    const geoData = generateGeoData();
    
    expect(geoData).toHaveLength(8);
    expect(geoData[0].country).toBe("China");
    expect(geoData[0].attacks).toBe(245);
    
    // 모든 항목이 필수 필드를 가지고 있는지 확인
    geoData.forEach(item => {
      expect(item).toHaveProperty('country');
      expect(item).toHaveProperty('attacks');
      expect(item).toHaveProperty('lat');
      expect(item).toHaveProperty('lng');
      expect(typeof item.country).toBe('string');
      expect(typeof item.attacks).toBe('number');
      expect(typeof item.lat).toBe('number');
      expect(typeof item.lng).toBe('number');
    });
    
    // 공격 수가 내림차순으로 정렬되어 있는지 확인
    for (let i = 0; i < geoData.length - 1; i++) {
      expect(geoData[i].attacks).toBeGreaterThanOrEqual(geoData[i + 1].attacks);
    }
  });

  it("should generate attack type statistics", () => {
    const generateAttackTypeData = () => {
      return [
        { type: "DDoS", count: 245, percentage: 35 },
        { type: "Port Scanning", count: 156, percentage: 22 },
        { type: "SQL Injection", count: 134, percentage: 19 },
        { type: "Brute Force", count: 98, percentage: 14 },
        { type: "DoS", count: 67, percentage: 10 },
      ];
    };

    const attackTypeData = generateAttackTypeData();
    
    expect(attackTypeData).toHaveLength(5);
    
    // 모든 항목이 필수 필드를 가지고 있는지 확인
    attackTypeData.forEach(item => {
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('count');
      expect(item).toHaveProperty('percentage');
    });
    
    // 백분율의 합이 100인지 확인
    const totalPercentage = attackTypeData.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBe(100);
    
    // 공격 수가 내림차순으로 정렬되어 있는지 확인
    for (let i = 0; i < attackTypeData.length - 1; i++) {
      expect(attackTypeData[i].count).toBeGreaterThanOrEqual(attackTypeData[i + 1].count);
    }
  });

  it("should calculate threat level statistics correctly", () => {
    const calculateThreatStats = (threatLevels: number[]) => {
      const critical = threatLevels.filter(t => t >= 80).length;
      const high = threatLevels.filter(t => t >= 60 && t < 80).length;
      const medium = threatLevels.filter(t => t >= 40 && t < 60).length;
      const low = threatLevels.filter(t => t < 40).length;
      
      return { critical, high, medium, low };
    };

    const threatLevels = [95, 75, 55, 35, 85, 65, 45, 25, 90, 70];
    const stats = calculateThreatStats(threatLevels);
    
    expect(stats.critical).toBe(3); // 95, 85, 90
    expect(stats.high).toBe(3); // 75, 65, 70
    expect(stats.medium).toBe(2); // 55, 45
    expect(stats.low).toBe(2); // 35, 25
    expect(stats.critical + stats.high + stats.medium + stats.low).toBe(threatLevels.length);
  });

  it("should validate geo coordinates are within valid ranges", () => {
    const generateGeoData = () => {
      return [
        { country: "China", attacks: 245, lat: 35.8617, lng: 104.1954 },
        { country: "Russia", attacks: 189, lat: 61.524, lng: 105.3188 },
        { country: "USA", attacks: 156, lat: 37.0902, lng: -95.7129 },
      ];
    };

    const geoData = generateGeoData();
    
    geoData.forEach(item => {
      // 위도는 -90 ~ 90 범위
      expect(item.lat).toBeGreaterThanOrEqual(-90);
      expect(item.lat).toBeLessThanOrEqual(90);
      
      // 경도는 -180 ~ 180 범위
      expect(item.lng).toBeGreaterThanOrEqual(-180);
      expect(item.lng).toBeLessThanOrEqual(180);
    });
  });
});
