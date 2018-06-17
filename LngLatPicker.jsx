import React from 'react';

const GOOGLE_MAP_API_KEY = 'AIzaSyDnwSzSXXTHp_qUMFKNLpp_gb8icbutzRg';

export default class LngLatPicker extends React.Component {
  componentDidMount = () => {
    // APIがすでに読み込まれている場合（2回目以降のレンダリングの場合）は
    // APIファイルを重複して読み込まない。
    // Mapのインスタンス生成処理のみを行ってファンクションを終了する。
    if (document.google) return this.initGoogleMap();

    // APIが読み込まれていない場合（初回のレンダリングの場合）は読み込む。
    // Mapのインスタンス生成処理はまだ実行できないので、
    // API読み込み後にコールバックとして実行する。
    window.initGoogleMap = this.initGoogleMap;
    this.loadJS(
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&callback=initGoogleMap`,
    );
  };

  initGoogleMap = () => {
    const lat = 35.011892;
    const lng = 132.221816;
    var defaultPosition = new google.maps.LatLng(lat, lng);

    // マップの表示
    this.map = new google.maps.Map(this.refs.map, {
      zoom: 13,
      center: defaultPosition,
    });

    // マーカーを設置
    this.marker = new google.maps.Marker({
      position: defaultPosition,
      map: this.map,
      draggable: true,
    });

    // マーカーをドラッグで移動する
    this.marker.addListener('dragend', e => {
      const lat_lng = e.latLng;

      // 座標を表示
      document.getElementById('theLocation').value =
        lat_lng.lat() + ',' + lat_lng.lng();

      // マップの中心をずらす
      this.map.panTo(lat_lng);
    });

    // マーカーをクリックで移動する
    this.map.addListener('click', e => {
      const lat_lng = e.latLng;

      // 座標を表示
      document.getElementById('theLocation').value =
        lat_lng.lat() + ',' + lat_lng.lng();

      // マーカーを移動
      this.marker.setPosition(lat_lng);

      // マップの中心をずらす
      this.map.panTo(lat_lng);
    });
  };

  loadJS = src => {
    var ref = window.document.getElementsByTagName('script')[0];
    var script = window.document.createElement('script');
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  };

  render = () => {
    return (
      <div>
        <div
          ref="map"
          style={{ width: '400px', height: '300px', marginBottom: '2rem' }}
        />
      </div>
    );
  };
}
