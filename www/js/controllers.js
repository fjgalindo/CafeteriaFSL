angular.module('app.controllers', [])
    .controller('PedidoCtrl', ['$scope', 'historialPedidos', '$stateParams', function ($scope, historialPedidos, $stateParams) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.pedido = findElement(historialPedidos.pedidos, "codigo", $stateParams.pedidoId);
    }])

    .controller('PedidosRecientesCtrl', ['$scope', 'historialPedidos', function ($scope, historialPedidos) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        var recientes = historialPedidos.pedidos;
        $scope.actual = recientes.length -1;
        $scope.pedido = recientes[$scope.actual];

        console.log(historialPedidos);

        $scope.nav = {
            forward: function (pos) {
                if (recientes[pos + 1])
                    $scope.pedido = recientes[pos + 1];
                $scope.actual = pos + 1;
            },
            backward: function (pos) {
                if (recientes[pos - 1]) {
                    $scope.pedido = recientes[pos - 1];
                    $scope.actual = pos - 1;
                }
            },
            hasOlder: function (pos) {
                if (recientes[pos + 1]) {
                    return true;
                }
                return false;
            },
            hasNewer: function (pos) {
                if (recientes[pos - 1]) {
                    return true;
                }
                return false;
            }

        }

        $scope.pedidos = historialPedidos;
    }])

    .controller('OrderCtrl', ['$scope', '$ionicPopup', '$ionicModal', 'pedido', 'productoResource', 'historialPedidos', '$ionicHistory', 'totalPrice', function ($scope, $ionicPopup, $ionicModal, pedido, productoResource, historialPedidos, $ionicHistory, totalPrice) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.pedido = pedido;

        // A confirm dialog
        $scope.popConfirmar = function () {
            var myPopup = $ionicPopup.show({
                title: 'Advertencia',
                template: '<p style="text-align:justify">Comprueba que el pedido es correcto.<br><br> <p style="text-align:justify; color:red; font-weight:600">Una vez hecho, no se puede cancelar el pedido.</p></p>',
                buttons: [
                    {
                        text: 'Cancelar',
                        type: "button-assertive"
                    },
                    {
                        text: "Confirmar pedido",
                        type: 'button-positive',
                        onTap: function (e) {
                            pedido.estado="Pendiente";
                            setOrderDate(pedido);
                            //historialPedidos.pedidos.push(pedido);
                            var p = {};
                            angular.copy(pedido, p);
                            historialPedidos.pedidos.push(p);
                            pedido.productos = {};

                            $scope.modal.show();
                            $ionicHistory.nextViewOptions({
                              disableBack: true
                           });


                        }
                    }
                ]
            });
        };

        $ionicModal.fromTemplateUrl('templates/productos/info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function (prod) {
            $scope.prod = prod;
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }

        $ionicModal.fromTemplateUrl('templates/pedido/pedido-realizado.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.doOrder = function () {
            $scope.modal.show();
        }

        $scope.removeModal = function () {
            $scope.modal.hide();
        }


        $scope.cart = {
            MAX_ITEMS: 10,
            add: function (itemId) {
                var producto = productoResource.get(itemId);
                if (pedido.productos[itemId]) {
                    if (pedido.productos[itemId].cantidad < this.MAX_ITEMS) {
                        pedido.productos[itemId].cantidad += 1;
                        pedido.cTotal += 1;
                        pedido.pTotal += pedido.productos[itemId].precio;
                    }                               
                }
            },
            remove: function (itemId) {
                if (pedido.productos[itemId]) {
                    pedido.productos[itemId].cantidad -= 1;
                    pedido.cTotal -= 1;
                    pedido.pTotal -= pedido.productos[itemId].precio;
                    if (pedido.productos[itemId].cantidad == 0) {
                        delete pedido.productos[itemId];
                    }
                }
            }
        }

        console.log($scope.pedido);
    }])
    .controller('lecturaCtrl', ['$scope', '$ionicModal', 'pendientes', function ($scope, $ionicModal, pendientes) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $ionicModal.fromTemplateUrl('templates/admin/lectura.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.doOrder = function () {
          $scope.modal.show();

        }

        $scope.removeModal = function () {
            $scope.modal.hide();
        }
        console.log("pendientes" + pendientes);
        $scope.pendientes = pendientes;
        console.log($scope.pendientes);

  }])

  .controller('pedpendienteCtrl', ['$scope', 'pendientes', '$ionicModal', function ($scope, pendientes , $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/admin/Especificacion-articulo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.doOrder = function () {
        $scope.modal.show();
    }

    $scope.removeModal = function () {
        $scope.modal.hide();
    }

    console.log("pendientes"+pendientes);
    $scope.pendientes = pendientes;
    console.log($scope.pendientes);
  }])

    .controller('ProductosCtrl', ['$scope', '$ionicModal', 'productos', '$stateParams', 'pedido', function ($scope, $ionicModal, productos, $stateParams, pedido) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.tipo = $stateParams.type;
        $scope.productos = productos[$scope.tipo];
        $scope.pedido = pedido;

        $ionicModal.fromTemplateUrl('templates/productos/info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function (prod) {
            $scope.prod = prod;
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }


        $scope.cart = {
            MAX_ITEMS: 10,
            add: function (itemId) {
                //var index = pedido.productos.indexOf(findElement($scope.productos, "id", itemId));
                var producto = findElement($scope.productos, "id", itemId);
                if (!pedido.productos[itemId]) {
                    pedido.productos[producto.id] = producto;
                    pedido.productos[producto.id].cantidad = 1;
                    pedido.cTotal += 1;
                    pedido.pTotal += producto.precio;
                } else {
                    if (pedido.productos[itemId].cantidad < this.MAX_ITEMS) {
                        pedido.productos[itemId].cantidad += 1;
                        pedido.cTotal += 1;
                        pedido.pTotal += producto.precio;
                    }
                }  
            },
            remove: function (itemId) {
                if (pedido.productos[itemId]) {
                    pedido.productos[itemId].cantidad -= 1;
                    if (pedido.productos[itemId].cantidad == 0) {
                        delete pedido.productos[itemId];
                    }
                    pedido.cTotal -= 1;
                    pedido.pTotal -= pedido.productos[itemId].precio;
                }
            }
        }

    }])

    .controller('nuevoProductoCtrl',['$scope','$ionicModal', function($scope,$ionicModal){

        $ionicModal.fromTemplateUrl('templates/admin/nuevoProductoModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function () {
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }
    }])

    .controller('nuevaOfertaCtrl',['$scope','$ionicModal', function($scope,$ionicModal){

        $ionicModal.fromTemplateUrl('templates/admin/nuevaOfertaModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function () {
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }
    }])



    .controller('BocadillosCtrl', ['$scope', '$ionicModal', 'productos', function ($scope, $ionicModal, productos) {

        $scope.tipo = "bocadillos";
        $scope.productos = productos[$scope.tipo];

        $ionicModal.fromTemplateUrl('templates/productos/info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function (prod) {
            $scope.prod = prod;
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }
    }])

    .controller('BebidasCtrl', ['$scope', '$ionicModal', 'productos', function ($scope, $ionicModal, productos) {

        $scope.tipo = "bebidas";
        $scope.productos = productos[$scope.tipo];

        $ionicModal.fromTemplateUrl('templates/productos/info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function (prod) {
            $scope.prod = prod;
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }
    }])

    .controller('CafesCtrl', ['$scope', '$ionicModal', 'productos', function ($scope, $ionicModal, productos) {

        $scope.tipo = "cafes";
        $scope.productos = productos[$scope.tipo];

        $ionicModal.fromTemplateUrl('templates/productos/info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function (prod) {
            $scope.prod = prod;
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }
    }])

    .controller('BolleriaCtrl', ['$scope', '$ionicModal', 'productos', function ($scope, $ionicModal, productos) {

        $scope.tipo = "bolleria";
        $scope.productos = productos[$scope.tipo];

        $ionicModal.fromTemplateUrl('templates/productos/info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_info = modal;
        });

        $scope.viewProduct = function (prod) {
            $scope.prod = prod;
            $scope.modal_info.show();
        }

        $scope.hideModal = function () {
            $scope.modal_info.hide();
        }
    }]);

function findElement(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
            return arr[i];

    // will return undefined if not found; you could return a default instead
}



function setOrderDate(pedido){
  var today = new Date();

  // Setting time from today
  var time = today.getHours() + ":" + today.getMinutes();

  // Setting date from today
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
      dd = '0' + dd
  }

  if (mm < 10) {
      mm = '0' + mm
  }

  today = dd + '/' + mm  + '/' + yyyy;

  pedido.fecha = today+" - " +time;
}
