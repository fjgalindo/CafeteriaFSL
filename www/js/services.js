angular.module('app.services', [])

    .constant('dataBaseUrl', 'data/')

    .provider("pedidoResource", PedidoResourceProvider)

    .config(['dataBaseUrl', 'pedidoResourceProvider', 'productoResourceProvider', function (dataBaseUrl, pedidoResourceProvider, productoResourceProvider) {
        pedidoResourceProvider.setBaseUrl(dataBaseUrl);
        productoResourceProvider.setBaseUrl(dataBaseUrl);
  }])

  .provider("PendienteResource", PendienteResourceProvider)

  .config(['dataBaseUrl' , 'PendienteResourceProvider', function (dataBaseUrl, PendienteResourceProvider) {
    PendienteResourceProvider.setBaseUrl(dataBaseUrl);
   
  }])
    .provider("productoResource", ProductoResourceProvider)

    /* DEFINICIÓN DE CLASES */
    .service('producto', function () {
        this.id = "";
        this.nombre = "";
        this.img = "";
        this.ingredientes = "";
        this.precio = 0;
        this.cantidad = 0;
    })

    .service('reserva', function () {
        this.dia_recogida;
        this.hora_recogida = "10:50";
    })

    .service('usuario', function () {
        this.saldo = 10.00;
    })

    .service('pedido', ['reserva', 'totalPrice', function (reserva, totalPrice) {
        this.codigo = "000052";
        this.fecha = "";
        this.reserva = reserva;
        this.productos = {};
        this.cTotal = 0;
        this.pTotal = totalPrice(this.productos);
    }])

    .service('historialPedidos', function(){
        this.pedidos = [];
    })

    .service('pendientes ', function () {
        this.id ="";
        this.info = "";
        this.fecha = "";
        this.estado = "";
    })

    .value('totalPrice', function (productos) {
        var total = 0;
        for (var i in productos) {
            total += productos[i].precio;
        }
        return total;
    })
    
    .factory("Pedido", function(){
        var pedido = function(codigo, fecha, cTotal){
            this.codigo = codigo;
            this.fecha = "";
            this.reserva = reserva;
            this.productos = {};
            this.cTotal = 0;
            this.pTotal = totalPrice(this.productos);
        }
        
    })
;

function PedidoResource($http, baseUrl) {
    this.get = function (pedidoId) {
        return new Promise(function (resolve, reject) {
            $http.get(baseUrl + 'historial-pedidos.json')
                .then(function successCallback(response) {
                    
                    resolve(response.data);
                }, function errorCallback(response) {
                    reject(response.data, response.status);
                })
        });
    };

    this.list = function () {
        return new Promise(function (resolve, reject) {
            $http.get(baseUrl + 'historial-pedidos.json')
                .then(function successCallback(response) {
                    resolve(response.data);
                }, function errorCallback(response) {
                    reject(response.data, response.status);
                })
        });
    }
}


function PedidoResourceProvider() {
    var _baseUrl;
    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    }
    this.$get = ['$http', function ($http) {
        return new PedidoResource($http, _baseUrl);
    }];
}




function ProductoResource($http, baseUrl) {
    this.get = function (productoId) {
        return new Promise(function (resolve, reject) {
            $http.get(baseUrl + 'productos.json')
                .then(function successCallback(response) {
                    var productos = response.data;
                    resolve(findElement(productos, "id", productoId));
                }, function errorCallback(response) {
                    reject(response.data, response.status);
                })
        });
    };

    this.list = function () {
        return new Promise(function (resolve, reject) {
            $http.get(baseUrl + 'productos.json')
                .then(function successCallback(response) {
                    resolve(response.data);
                }, function errorCallback(response) {
                    reject(response.data, response.status);
                })
        });
    }
}

function ProductoResourceProvider() {
    var _baseUrl;
    this.setBaseUrl = function (baseUrl) {
        _baseUrl = baseUrl;
    }
    this.$get = ['$http', function ($http) {
        return new ProductoResource($http, _baseUrl);
    }];
}

//-----------------------------pedido-pendiente-------------------------------------------//
function PendienteResource($http, baseUrl) {
  this.get = function (pendienteId) {
    return new Promise(function (resolve, reject) {
      $http.get(baseUrl + 'pedidos-pendiente.jsonsssssssssssss')
        .then(function successCallback(response) {
          resolve(response.data);
        }, function errorCallback(response) {
          reject(response.data, response.status);
        })
    });
  };

  this.list = function () {
    return new Promise(function (resolve, reject) {
      $http.get(baseUrl + 'pedido-pendiente.json')
        .then(function successCallback(response) {
            console.log("this.list ");
          resolve(response.data);
        }, function errorCallback(response) {
          reject(response.data, response.status);
        })
    });
  }
}

function PendienteResourceProvider() {
  var _baseUrl;
  this.setBaseUrl = function (baseUrl) {
    _baseUrl = baseUrl;
  }
  this.$get = ['$http', function ($http) {
    return new PendienteResource($http , _baseUrl);
  }];
}


