(function(){

    PluginNeedReload=['VirtualButtons_OnlyForSelf.js'];

    PluginManager.loadScript = function (name) { 
        var url = this._path + name;
        if(PluginNeedReload.contains(name)) url=url+"?time="+Date.now();
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        script._url = url;
        document.body.appendChild(script);
    };
}());