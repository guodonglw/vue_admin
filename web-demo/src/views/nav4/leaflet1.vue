<template>
    <div>
        <div>
            <h3>示例</h3>
        </div>

        <!--基本信息描述-->
        <hr />
        <div style="height: 47%; overflow: auto;">
            <h3>基本信息</h3>
            <label>图标位置:</label>
            <select v-model="zoomPosition">
                <option
                v-for="(position, index) in Positions"
                :key="index"
                :value="position"
                >{{ position }}</option>
            </select>
            <label class="margin">图层控制图标位置:</label>
            <select v-model="layersPosition">
                <option
                v-for="(position, index) in Positions"
                :key="index"
                :value="position"
                >{{ position }}</option>
            </select>
            <label class="margin">Attribution位置:</label>
            <select v-model="attributionPosition">
                <option
                v-for="(position, index) in Positions"
                :key="index"
                :value="position"
                >{{ position }}</option>
            </select>
            <label class="margin">地图缩放: 比例</label>
            <input v-model.number="zoom" type="number"/>
            <br />
            <br />
            中心点 : <span> {{ center }} </span>
            <br />
            边界范围 : <span> {{ bounds }} </span>
            <br />
            <br />
            <button name="button" @click="fitPolyline">根据折线绘制地图</button>
            <br />
            <hr />

            <h3>标记列表</h3>
            <button name="button" @click="addMarker">增加一个标记</button>
            <br />
            <br />
            <table class="table">
                <tr>
                    <th>标记</th>
                    <th>纬度</th>
                    <th>经度</th>
                    <th>提示</th>
                    <th>是否可拖动?</th>
                    <th>是否可见?</th>
                    <th>移除</th>
                </tr>
                <tr v-for="(item, index) in markers" :key="index">
                    <td>{{ "Marker " + (index + 1) }}</td>
                    <td><input v-model.number="item.position.lat" type="number"/></td>
                    <td><input v-model.number="item.position.lng" type="number" /></td>
                    <td><input v-model="item.tooltip" type="text" /></td>
                    <td style="text-align: center">
                        <input v-model="item.draggable" type="checkbox" />
                    </td>
                    <td style="text-align: center">
                        <input v-model="item.visible" type="checkbox" />
                    </td>
                    <td style="text-align: center">
                        <input type="button" value="X" @click="removeMarker(index)" />
                    </td>
                </tr>
            </table>
            <hr />
            <table class="table">
                <tr>
                    <th>图层</th>
                    <th>是否可见?</th>
                    <th>标记是否可见?</th>
                    <th>折线图是否可见?</th>
                </tr>
                <tr v-for="(item, index) in stuff" :key="index">
                    <td>{{ "Layer " + (index + 1) }}</td>
                    <td style="text-align: center">
                        <input v-model="item.visible" type="checkbox" />
                    </td>
                    <td style="text-align: center">
                        <input v-model="item.markersVisible" type="checkbox" />
                    </td>
                    <td style="text-align: center">
                        <input v-model="item.polyline.visible" type="checkbox" />
                    </td>
                </tr>
            </table>
            <hr />
        </div>

        <!--地图绘制区域-->
        <l-map :zoom.sync="zoom" :options="mapOptions" :center="center" :bounds="bounds" :min-zoom="minZoom"
            :max-zoom="maxZoom" style="width: 100%; height: 800px;">
            <l-control-layers :position="layersPosition" :collapsed="false" :sort-layers="true"/>
            <l-tile-layer v-for="tileProvider in tileProviders" :key="tileProvider.name" :name="tileProvider.name" :visible="tileProvider.visible"
                :url="tileProvider.url" :attribution="tileProvider.attribution" :token="token" layer-type="base"/>
            <l-control-zoom :position="zoomPosition" />
            <l-control-attribution :position="attributionPosition" :prefix="attributionPrefix"/>
            <l-control-scale :imperial="imperial" />
            <l-marker v-for="marker in markers" :key="marker.id" :visible="marker.visible" :draggable="marker.draggable"
                :lat-lng.sync="marker.position" :icon="marker.icon" @click="alert(marker)">
                <l-popup :content="marker.tooltip" />
                <l-tooltip :content="marker.tooltip" />
            </l-marker>
            <l-layer-group layer-type="overlay" name="Layer polyline">
                <l-polyline v-for="item in polylines" :key="item.id" :lat-lngs="item.points" :visible="item.visible"
                @click="alert(item)"/>
            </l-layer-group>
            <l-layer-group v-for="item in stuff" :key="item.id" :visible="item.visible" layer-type="overlay" name="Layer 1">
                <l-layer-group :visible="item.markersVisible">
                    <l-marker v-for="marker in item.markers" :key="marker.id" :visible="marker.visible" :draggable="marker.draggable"
                        :lat-lng="marker.position" @click="alert(marker)"/>
                </l-layer-group>
                <l-polyline :lat-lngs="item.polyline.points" :visible="item.polyline.visible" @click="alert(item.polyline)"/>
            </l-layer-group>
        </l-map>

    </div>
</template>

<script>
    /*该页面若加载时出现大量变量无法找到，请到main.js中添加必要依赖*/
    import { icon, latLngBounds } from "leaflet";
    import { LMap, LTileLayer, LMarker, LPolyline, LLayerGroup, LTooltip, LPopup, LControlZoom, LControlAttribution, LControlScale, LControlLayers } from "vue2-leaflet";
    const markers1 = [
        {
            position: { lng: 113.9, lat: 35.5 },
            visible: true,
            draggable: true
        },
        { position: { lng: 114.5, lat: 37.5 } },
        { position: { lng: 114, lat: 38.2 } },
        { position: { lng: 114.2, lat: 38.9 } },
        { position: { lng: 114.5, lat: 39 } },
        { position: { lng: 114.7, lat: 40.5 } },
        { position: { lng: 114.2, lat: 41 } },
        { position: { lng: 112, lat: 40.3 } },
        { position: { lng: 110.8, lat: 39 } },
        { position: { lng: 110.3, lat: 38 } },
        { position: { lng: 110.5, lat: 37.5 } },
        { position: { lng: 110.3, lat: 37 } },
        { position: { lng: 110.3, lat: 35.5 } },
        { position: { lng: 109.8, lat: 34 } },
        { position: { lng: 113.9, lat: 35.5 } },
    ];
    const poly1 = [
        { lng: 113.9, lat: 35.5},
        { lng: 114.5, lat: 37.5 },
        { lng: 114, lat: 38.2 },
        { lng: 114.2, lat: 38.9 },
        { lng: 114.5, lat: 39},
        { lng: 114.7, lat: 40.5},
        { lng: 114.2, lat: 41},
        { lng: 112, lat: 40.3},
        { lng: 110.8, lat: 39},
        { lng: 110.3, lat: 38},
        { lng: 110.5, lat: 37.5},
        { lng: 110.3, lat: 37},
        { lng: 110.3, lat: 35.5},
        { lng: 109.8, lat: 34},
        { lng: 113.9, lat: 35.5}
    ];
    const tileProviders = [
        {
            name: "OpenStreetMap",
            visible: true,
            attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        {
            name: "OpenTopoMap",
            visible: false,
            url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
    ];
    export default {
        name: "Example",
        components: {
            LMap,
            LTileLayer,
            LMarker,
            LPolyline,
            LLayerGroup,
            LTooltip,
            LPopup,
            LControlZoom,
            LControlAttribution,
            LControlScale,
            LControlLayers
        },
        data () {
            return {
                center: [40, 116],
                opacity: 0.6,
                token: "your token if using mapbox",
                mapOptions: {
                    zoomControl: false,
                    attributionControl: false,
                    zoomSnap: true
                },
                zoom: 13,
                minZoom: 1,
                maxZoom: 20,
                zoomPosition: "topleft",
                attributionPosition: "bottomright",
                layersPosition: "topright",
                attributionPrefix: "Vue2Leaflet",
                imperial: false,
                Positions: ["topleft", "topright", "bottomleft", "bottomright"],
                tileProviders: tileProviders,
                markers: [
                    {
                        id: "m1",
                        position: { lat: 39.9, lng: 116.4 },
                        tooltip: "This is marker1",
                        draggable: true,
                        visible: true,
                        icon: icon.glyph({
                            prefix: "",
                            glyph: "A"
                        })
                    },
                    {
                        id: "m2",
                        position: { lat: 40.001, lng: 116 },
                        tooltip: "This is marker2",
                        draggable: true,
                        visible: false
                    },
                    {
                        id: "m3",
                        position: { lat: 39.905, lng: 116 },
                        tooltip: "This is marker3",
                        draggable: true,
                        visible: true
                    },
                    {
                        id: "m4",
                        position: { lat: 39.899, lng: 116},
                        tooltip: "This is marker4",
                        draggable: true,
                        visible: false
                    }
                ],
                polylines: [
                    {
                        id: "p1",
                        points: [
                            { lat: 39.8, lng: 116.6},
                            { lat: 40.1, lng: 116.6 },
                            { lat: 40.1, lng: 116.2},
                            { lat: 39.8, lng: 116.2 },
                            { lat: 39.8, lng: 116.6}
                        ],
                        visible: true
                    },
                    {
                        id: "p2",
                        points: [[-73.91, 40.78], [-87.62, 41.83], [-96.72, 32.76]],
                        visible: true
                    }
                ],
                stuff: [
                    {
                        id: "s1",
                        markers: markers1,
                        polyline: { points: poly1, visible: true },
                        visible: true,
                        markersVisible: true
                    }
                ],
                bounds: latLngBounds(
                    { lat: 39.78, lng: 116.199},
                    { lat: 40.12, lng: 116.49 }
                )
            };
        },
        methods: {
            alert(item) {
                alert("this is " + JSON.stringify(item));
            },
            addMarker: function() {
                const newMarker = {
                    position: { lat: 50.5505, lng: -0.09 },
                    draggable: true,
                    visible: true
                };
                this.markers.push(newMarker);
            },
            removeMarker: function(index) {
                this.markers.splice(index, 1);
            },
            fitPolyline: function() {
                const bounds = latLngBounds(markers1.map(o => o.position));
                this.bounds = bounds;
            }
        }
    };
</script>

<style scoped>
    .table {
        border:1px solid #333;
        border-collapse:collapse;
    }

    .table th,.table td {
        border:1px solid #333;
    }

    .margin {
        margin-left: 20px;
    }

    input {
        text-align:center;
    }

    .table input {
        border: none;
    }

</style>
