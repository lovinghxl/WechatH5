
//微信支付方法
function onBridgeReady(data, id){
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": data.appId,
        "timeStamp": data.timeStamp,
        "nonceStr":  data.nonceStr,
        "package": data.package,
        "signType": data.signType,
        "paySign": data.paySign
      },
      ((res) => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
            alert('支付成功')
        //   this.showHiddenLoding = false
        //   this.$router.push('/stayDetailsToBePaid/' + id);
        }else{
            alert('支付失败')
        //   this.showHiddenLoding = false
        //   this.$message({
        //     type: 'error',
        //     text:'支付失败',
        //   });
        //   this.$router.push('/stayDetailsToBePaid/' + id);
        }
      })
    )
}

//获取URL参数
function getQueryString (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null

    // return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    // let obtain = decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    // return obtain;
}

module.exports = {
    onBridgeReady,
    getQueryString
}