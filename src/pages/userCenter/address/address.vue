<template>
    <div class="wrap">
        <div>
            <van-address-list
                v-model="addressListInfo.chosenAddressId"
                :list="addressListInfo.list"
                @add="handelAddAddress"
                @edit="handelEditAddress"
                @select="handelPitchOnAddress"
            />
        </div>
        <!-- 新增/修改地址 -->
        <van-popup v-model="editAddressShow" position="bottom">
            <div class="edit-address">
                <van-field
                    v-model="addAndEditAddress.userName"
                    required
                    clearable
                    label="姓名"
                    placeholder="请输入收货人姓名"
                    :error-message="errnoTips.userName"
                />
                <van-field
                    v-model="addAndEditAddress.telNumber"
                    required
                    clearable
                    type="number"
                    label="手机号"
                    placeholder="请输入手机号"
                    :error-message="errnoTips.telNumber"
                />
                <div @click="handelAddressSelectedShow">
                    <van-field
                        v-model="address"
                        required
                        clearable
                        label="地区"
                        placeholder="选着省/市/区"
                        readonly
                        :error-message="errnoTips.countyName"
                    />
                </div>
                <van-field
                    v-model="addAndEditAddress.detailInfo"
                    required
                    clearable
                    label="详细地址"
                    placeholder="街道门牌、楼层等房间号等信息"
                    :error-message="errnoTips.detailInfo"
                />
                <van-field
                    v-model="addAndEditAddress.postalCode"
                    clearable
                    required
                    label="邮政编码"
                    placeholder="邮政编码"
                    :error-message="errnoTips.errnoTips"
                />
                <van-row class="default">
                    <van-col span="12" class="default-text">
                        设为默认收货地址
                    </van-col>
                    <van-col span="12" class="text-right">
                        <van-switch
                            v-model="addAndEditAddress.is_default"
                            size="24px"
                        />
                    </van-col>
                </van-row>
                <van-row class="btn">
                    <van-col span="24">
                        <van-button @click="handelHoldAddress" type="danger" size="large">保存</van-button>
                    </van-col>
                    <van-col span="24">
                        <van-button @click="handelDeleteAddress" v-show="addAndEditAddress.id != 0" type="default" size="large">删除</van-button>
                    </van-col>
                </van-row>
            </div>
        </van-popup>
        <!-- 地区选着 -->
        <van-popup v-model="addressSelectedShow" position="bottom">
            <van-row class="header">
                <van-col span="15">
                    <van-row type="flex" justify="space-around">
                        <van-col span="7" class="header-text" :class="{'active':provinceListShow}"><div @click="handelPpreviousSelectedAddress(1)">{{selectedProvinceName}}</div></van-col>
                        <van-col span="7" class="header-text" :class="{'active':cityListShow}"><div @click="handelPpreviousSelectedAddress(2)">{{selectedCityName}}</div></van-col>
                        <van-col span="7" class="header-text" :class="{'active':countyistShow}"><div @click="handelPpreviousSelectedAddress(3)">{{selectedCountyName}}</div></van-col>
                    </van-row>
                </van-col>
                <van-col span="9" class="text-right">
                    <span @click="handelConfirmSelectedAddress">
                        确定
                    </span>
                </van-col>
            </van-row>
            <!-- 省列表 -->
            <van-row class="lsit" v-show="provinceListShow">
                <van-row
                    class="list-item text-center" 
                    v-for="item in resultInfo.provinceList" 
                    :key="item.id"
                >
                    <div @click="handelProvince(item.name)">
                        {{item.name}}
                    </div>
                </van-row>
            </van-row>
            <!-- 城市列表 -->
            <van-row class="lsit" v-show="cityListShow">
                <van-row
                    class="list-item text-center" 
                    v-for="item in resultInfo.cityList" 
                    :key="item.id"
                >
                    <div @click="handelCity(item.name)">
                        {{item.name}}
                    </div>
                </van-row>
            </van-row>
            <!-- 悬/区列表 -->
            <van-row class="lsit" v-show="countyistShow">
                <van-row
                    class="list-item text-center" 
                    v-for="item in resultInfo.cityList" 
                    :key="item.id"
                >
                    <div @click="handelCounty(item.name)">
                        {{item.name}}
                    </div>
                </van-row>
            </van-row>
        </van-popup>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'vAddress',
    data () {
        return {
            addressListInfo: { //地址列表
                chosenAddressId: '',
                list: [
                    {
                        id: '',
                        name: '',
                        tel: '',
                        address: ''
                    }
                ]
            },
            editAddressShow: false,
            addressSelectedShow: false,
            provinceListShow: true,
            cityListShow: false,
            countyistShow: false,
            addAndEditAddress: {
                id: 0,
                userName: '', //收货人姓名
                telNumber: '', //收货人电话
                postalCode: '', //邮政编码
                provinceName: '选着省', //省
                cityName: '城市', //市
                countyName: '区/县', //区/县
                detailInfo: '', //详细地址信息
                is_default: true, //是否默认收货地址 1 表示默认收货地址(默认值为0)
                full_region: '', //省市区详细地址之和
            },
            resultInfo: {
                provinceList: [],
                cityList: [],
                countyList: []
            },
            selectedProvinceName: '选着省', //省
            selectedCityName: '城市', //市
            selectedCountyName: '区/县', //区/县
            errnoTips: { //表单验证
                userName: '', //收货人姓名
                telNumber: '', //收货人电话
                countyName: '', //区/县
                countyName: '',
                detailInfo: '',
                postalCode: ''
            }
        }
    },
    computed: {
        address: function () {
            return this.addAndEditAddress.provinceName + '/' + this.addAndEditAddress.cityName + '/' + this.addAndEditAddress.countyName
        },
        addressListLength: function () {
            return this.addressListInfo.list.length == 0
        }
    },
    created: function () {
        this.getInfo()
    },
    mounted: function () {
        
    },
    methods: {
        getInfo () { //获取收货地址列表
            API.getAddressList().then((data) => {
                const _res = data.data
                if (_res.errno === 0) {
                    //根据框架api要求处理数据
                    for (let i=0;i<_res.data.length;i++) {
                        _res.data[i]['name'] = _res.data[i].userName
                        _res.data[i]['tel'] = _res.data[i].telNumber
                        _res.data[i]['address'] = _res.data[i].full_region
                        if (_res.data[i].is_default === 1) {
                            this.addressListInfo.chosenAddressId = _res.data[i].id
                        }
                    }
                }
                this.addressListInfo.list = _res.data
            })
        },
        //地址列表
        handelAddAddress (item) { //新增地址
            this.editAddressShow = !this.editAddressShow
            this.addAndEditAddress =  {id: 0,userName: '',telNumber: '',postalCode: '',provinceName: '选着省',cityName: '城市',countyName: '区/县',detailInfo: '',is_default: true,full_region: '',}
        },
        handelEditAddress (item, index) { //编辑地址
            this.editAddressShow = !this.editAddressShow
            let itemAddress = item
            itemAddress.is_default = itemAddress.is_default ? true : false
            this.addAndEditAddress = itemAddress
        },
        handelPitchOnAddress (item, index) { //选中地址
            if (item.is_default == true) {
                return
            } else {
                item.isDefault = 1
                let params = item
                API.getAddressSaveOrUpdate(params).then((data) => {})
            }
        },
        handelHoldAddress () {  //保存地址
            //判断地址是否填写完整
            if (this.addAndEditAddress.userName == '') {
                this.errnoTips.userName = '姓名不能为空'
                return
            }
            if (this.addAndEditAddress.telNumber == '') {
                this.errnoTips.telNumber = '手机号码不能为空'
                return
            } else if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.addAndEditAddress.telNumber))) {
                this.errnoTips.telNumber = '手机号码有误'
                return
            }
            if (this.addAndEditAddress.countyName == '区/县') {
                this.errnoTips.countyName = '请选着地区'
                return
            }
            if (this.addAndEditAddress.detailInfo == '') {
                this.errnoTips.detailInfo = '详细地址不能为空'
                return
            }
            if (this.addAndEditAddress.postalCode == '') {
                this.errnoTips.errnoTips = '邮政编码不能为空'
                return
            } else if (!(/^[1-9][0-9]{5}$/.test(this.addAndEditAddress.postalCode))) {
                this.errnoTips.errnoTips = '邮政编码有误'
                return
            }
            //提交地址
            let addAndEditAddress = this.addAndEditAddress
            addAndEditAddress.is_default = addAndEditAddress.is_default ? 1 : 0 //默认地址
            addAndEditAddress.isDefault = addAndEditAddress.is_default
            let params = addAndEditAddress
            API.getAddressSaveOrUpdate(params).then((data) => {
                if (data.data.errno == 0) {
                    this.getInfo()
                    this.editAddressShow = false
                    this.$toast.success('提交成功')
                } else {
                    this.$toast.fail('提交失败')
                }
            })
        },
        handelAddressSelectedShow () { 
            this.selectedProvinceName = '选着省' //省
            this.selectedCityName = '城市' //市
            this.selectedCountyName = '区/县' //区/县
            this.provinceListShow = true
            this.cityListShow = false
            this.countyistShow = false
            API.getAddressGetProvice().then((data) => { //获取省数据
                const _res = data.data
                if (_res.code == 0) {
                    this.resultInfo.provinceList = _res.list
                }
            })
            this.addressSelectedShow = true
        },
        handelProvince (name) { //点击省
            this.selectedProvinceName = name
            let params = {proviceName: name}
            API.getAddressGetCitys(params).then((data) => {
                const _res = data.data
                if (_res.code == 0) {
                    this.resultInfo.cityList = _res.list
                    this.provinceListShow = false
                    this.cityListShow = true
                }
            })
        },
        handelCity (name) { //点击城市
            this.selectedCityName = name
            let params = {proviceName: this.selectedProvinceName, cityName: name}
            API.getAddressGetDistricts(params).then((data) => {
                const _res = data.data
                if (_res.code == 0) {
                    this.resultInfo.cityList = _res.list
                    this.cityListShow = false
                    this.countyistShow = true
                }
            })
        },
        handelCounty (name) { // 点击悬/区
            this.selectedCountyName = name
        },
        handelConfirmSelectedAddress () { //确定选中地址
            if (this.selectedProvinceName != '选着省' && this.selectedCityName != '城市' && this.selectedCountyName != '区/县') {
                this.addAndEditAddress.provinceName = this.selectedProvinceName
                this.addAndEditAddress.cityName = this.selectedCityName
                this.addAndEditAddress.countyName = this.selectedCountyName
                this.addressSelectedShow = !this.addressSelectedShow
            } else {
                this.$toast.fail('请选着完整')
            }
        },
        handelPpreviousSelectedAddress ($index) {
            // if ($index === 1) {
            //     this.provinceListShow = true
            //     this.cityListShow = false
            //     this.countyistShow = false
            // } else if ($index === 2) {
            //     this.provinceListShow = false
            //     this.cityListShow = true
            //     this.countyistShow = false
            // } else {
            //     this.provinceListShow = false
            //     this.cityListShow = false
            //     this.countyistShow = true
            // }
        },
        handelDeleteAddress () { //删除收货地址
            this.$dialog.confirm({
                title: '提示',
                message: '确定要删除此收货地址？'
            }).then(() => {
                let params = {id: this.addAndEditAddress.id}
                API.getAddressDelete(params).then((data) => {
                    if (data.data.errno == 0) {
                        this.getInfo()
                        this.editAddressShow = false
                        this.$toast.success(data.data.data)
                    } else {
                        this.$toast.success('删除失败')
                    }
                })
            })
        }
    },
    watch: {
        editAddressShow: function () {
            let addAddressBtn = document.querySelectorAll('.van-address-list__add')[0]
            if (this.editAddressShow) {
                addAddressBtn.style.display = 'none'
            } else {
                addAddressBtn.style.display = ''
            }
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;}
    .van-address-list__add{z-index: 99;}
    .index{z-index: 99999!important;}
    /* 新增/修改地址 */
    .edit-address{width: 100%;background: #fff;}
    .default{color: #323233;font-size: 14px;padding: 10px 15px;}
    .default .default-text{line-height: 25px;}
    /* 地区选着 */
    .header{padding: 0 5px;line-height: 45px;border-bottom: .5px solid #ededed;}
    .header-text div{overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
    .lsit{height: 300px;line-height: 35px;overflow-y: scroll;font-size: 14px;color: #323233;}
    .lsit .list-item{border-bottom: .5px solid #ededed;}
    .active{color: #f44}
</style>