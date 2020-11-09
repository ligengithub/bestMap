export const notEmpty = (value) => {
    return !(value === null || value === undefined);
};

export const isNullOrUndefined = (value) => {
    return value === '' || value === undefined || value === null;
};


const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
export const bd09togcj02 = (bd_lon, bd_lat) => {
    var bd_lon = +bd_lon;
    var bd_lat = +bd_lat;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
};

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export const gcj02tobd09 = (lng, lat) => {
    var lat = +lat;
    var lng = +lng;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
};

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export const wgs84togcj02 = (lng, lat) => {
    var lat = +lat;
    var lng = +lng;
    if (outOfChina(lng, lat)) {
        return [lng, lat]
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat]
    }
};

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export const gcj02towgs84 = (lng, lat) => {
    var lat = +lat;
    var lng = +lng;
    if (outOfChina(lng, lat)) {
        return [lng, lat]
    } else {
        var dlat = this.transformlat(lng - 105.0, lat - 35.0);
        var dlng = this.transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
};

export const transformlat = (lng, lat) => {
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
};

export const transformlng = (lng, lat) => {
    var lat = +lat;
    var lng = +lng;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
};

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
export const outOfChina = (lng, lat) => {
    var lat = +lat;
    var lng = +lng;
    // 纬度3.86~53.55,经度73.66~135.05
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
};


export const transLinePath = (linePath, type) => {
    let result = [];
    // 在中国转化
    if (type === 1) {
        // 大地转火星
        linePath.forEach(p => {
            let wgs84togcj = wgs84togcj02(p[0], p[1]);
            result.push(wgs84togcj)
        })
    } else if (type === 2) {
        // 大地转百度  2步骤，先转火星，再转百度
        let temp = [];
        // 大地转火星
        linePath.forEach(p => {
            let wgs84togcj = wgs84togcj02(p[0], p[1]);
            temp.push(wgs84togcj)
        });
        // 火星转百度
        temp.forEach(p => {
            let gcj02tobd = gcj02tobd09(p[0], p[1]);
            result.push(gcj02tobd)
        })
    } else if (type === 3) {
        // 火星转百度
        linePath.forEach(p => {
            let gcj02tobd = gcj02tobd09(p[0], p[1]);
            result.push(gcj02tobd)
        })
    } else if (type === 4) {
        // 百度转火星
        linePath.forEach(p => {
            let gcj02tobd = bd09togcj02(p[0], p[1]);
            result.push(gcj02tobd)
        })
    } else {
        // 不转换
        result = linePath;
    }
    return result;
}


export const calculateLineDistance = (start, end) => {
    let d1 = 0.01745329251994329;
    let d2 = start[0];
    let d3 = start[1];
    let d4 = end[0];
    let d5 = end[1];
    d2 *= d1;
    d3 *= d1;
    d4 *= d1;
    d5 *= d1;
    let d6 = Math.sin(d2);
    let d7 = Math.sin(d3);
    let d8 = Math.cos(d2);
    let d9 = Math.cos(d3);
    let d10 = Math.sin(d4);
    let d11 = Math.sin(d5);
    let d12 = Math.cos(d4);
    let d13 = Math.cos(d5);
    let arrayOfDouble1 = [];
    let arrayOfDouble2 = [];
    arrayOfDouble1.push(d9 * d8);
    arrayOfDouble1.push(d9 * d6);
    arrayOfDouble1.push(d7);
    arrayOfDouble2.push(d13 * d12);
    arrayOfDouble2.push(d13 * d10);
    arrayOfDouble2.push(d11);
    let d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
        (arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
        (arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));
    return (Math.asin(d14 / 2.0) * 12742001.579854401);
}
