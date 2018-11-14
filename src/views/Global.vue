<script>
  /*自定义一些全局配置*/
  const serverIp='http://192.168.100.135:3003/';
  const htmlJson='http://pdae2q9v2.bkt.clouddn.com/html.json';
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
  }
</script>

