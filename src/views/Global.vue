<script>
  /*自定义一些全局配置*/
  const serverIp='http://192.168.99.45:3003/';
  const htmlJson='https://czy-1257069199.cos.ap-beijing.myqcloud.com/html/test/app/html.json';
  const kuaYu='https://bird.ioliu.cn/v1/?url=';
  const validateMany = (rule, value, callback) => {
    var that=this;
    var patrn=/^^[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/;
    if (value === '' || !value) {
      callback(new Error('不能为空'));
    }else if (!patrn.exec(value)){
      callback(new Error('1-20个汉字字母、数字、下划线'));
    }
    callback();
  };
  export default
  {
    serverIp,
    validateMany,
    htmlJson,
    kuaYu,
  }
</script>

