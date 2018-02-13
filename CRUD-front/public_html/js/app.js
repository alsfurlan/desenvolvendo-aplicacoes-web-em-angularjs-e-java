var app = angular.module('produtosApp', []);

app.controller('ProdutosController', function ($scope, ProdutosService) {

    $scope.produto = {};

    listar();

    function listar() {
        ProdutosService.listar().then(function (resposta) {
            $scope.produtos = resposta.data;
        });
    }

    $scope.salvar = function (produto) {
        ProdutosService.salvar(produto).then(listar);
        $scope.produto = {};
    };

    $scope.editar = function (produto) {
        $scope.produto = angular.copy(produto);
    };

    $scope.excluir = function (produto) {
        ProdutosService.excluir(produto).then(listar);
    };

    $scope.cancelar = function () {
        $scope.produto = {};
    };
});

app.service('ProdutosService', function ($http) {

    var api = 'http://localhost:8080/api/webresources/produtos';

    this.listar = function () {
        return $http.get(api);
    };

    this.salvar = function (produto) {
        if (produto.id) {
            return $http.put(api + '/' + produto.id, produto);
        } else {
            return $http.post(api, produto);
        }
    };

    this.excluir = function (produto) {
        return $http.delete(api + '/' + produto.id);
    };

});
