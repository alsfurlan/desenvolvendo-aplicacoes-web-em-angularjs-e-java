var app = angular.module('produtosApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
    $routeProvider.when('/cadastro', {
        templateUrl: 'templates/cadastro.html',
        controller: 'CadastroProdutosController'
    }).when('/cadastro/:id', {
        templateUrl: 'templates/cadastro.html',
        controller: 'CadastroProdutosController'
    }).when('/tabela', {
        templateUrl: 'templates/tabela.html',
        controller: 'TabelaProdutosController'
    }).otherwise('/tabela');
});

app.controller('TabelaProdutosController', function ($scope, ProdutosService) {

    listar();

    function listar() {
        ProdutosService.listar().then(function (produtos) {
            $scope.produtos = produtos;
        });
    }

    $scope.excluir = function (produto) {
        ProdutosService.excluir(produto).then(listar);
    };

});

app.controller('CadastroProdutosController', function ($routeParams, $scope, $location, ProdutosService) {

    var id = $routeParams.id;

    if (id) {
        ProdutosService.getProduto(id).then(function (produto) {
            $scope.produto = produto;
        });
    } else {
        $scope.produto = {};
    }

    function salvar(produto) {
        $scope.produto = {};
        return ProdutosService.salvar(produto);
    }

    function redirecionarTabela() {
        $location.path('/tabela');
    }

    function erros(erros) {
        $scope.erros = erros.data;
    }

    $scope.salvar = function (produto) {
        salvar(produto).then(redirecionarTabela, erros);
    };

    $scope.salvarCadastrarNovo = function (produto) {
        salvar(produto).then(function () {
            $scope.cadastroProdutosForm.$setPristine();
        }, erros);
    };
    $scope.cancelar = redirecionarTabela;

    function limparFormularioMovimentacao() {
        $scope.movimentacao = {};
    }
    
    $scope.adicionarMovimentacao = function (produto, movimentacao) {
        ProdutosService.adicionarMovimentacao(produto, movimentacao).then(function (produto) {
            $scope.produto = produto;
            limparFormularioMovimentacao();
        });
    };
    
    $scope.cancelarMovimentacao = limparFormularioMovimentacao;

});

app.service('ProdutosService', function (ProdutosResource) {

    this.getProduto = function (id) {
        return ProdutosResource.getProduto({id: id}).$promise;
    };

    this.listar = function () {
        return ProdutosResource.listar().$promise;
    };

    this.salvar = function (produto) {
        if (produto.id) {
            return ProdutosResource.atualizar({id: produto.id}, produto).$promise;
        } else {
            return ProdutosResource.salvar(produto).$promise;
        }
    };

    this.excluir = function (produto) {
        return ProdutosResource.excluir({id: produto.id}).$promise;
    };

    this.adicionarMovimentacao = function (produto, movimentacao) {
        return ProdutosResource.adicionarMovimentacao({id: produto.id}, movimentacao).$promise;
    };

});

app.factory('ProdutosResource', function ($resource) {

    var uri = 'http://localhost:8080/api/webresources/produtos/:id';

    return $resource(uri, {}, {
        atualizar: {
            method: 'PUT'
        },
        listar: {
            method: 'GET',
            isArray: true
        },
        getProduto: {
            method: 'GET'
        },
        salvar: {
            method: 'POST'
        },
        excluir: {
            method: 'DELETE'
        },
        adicionarMovimentacao: {
            method: 'POST',
            url: uri + '/movimentacoes',
            params: {
                id: '@id'
            }
        }
    });
});
