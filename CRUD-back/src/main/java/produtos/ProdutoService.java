package produtos;

import java.util.ArrayList;
import java.util.List;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Stateless
@Path("produtos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProdutoService {

    private static Integer contador = 1;
    private List<Produto> produtos;

    public ProdutoService() {
        produtos = new ArrayList<>();
    }

    @GET
    public List<Produto> getProdutos() {
        return produtos;
    }

    @POST
    public Produto adicionar(Produto produto) {
        produto.setId(contador++);
        produtos.add(produto);
        return produto;
    }

    @PUT
    @Path("{id}")
    public Produto atualizar(@PathParam("id") Integer id, Produto produto) {
        for (Produto p : produtos) {
            if (p.getId().equals(id)) {
                p.setDescricao(produto.getDescricao());
                p.setPreco(produto.getPreco());
                return p;
            }
        }
        return null;
    }

    @DELETE
    @Path("{id}")
    public Produto excluir(@PathParam("id") Integer id) {
        for (Produto p : produtos) {
            if (p.getId().equals(id)) {
                produtos.remove(p);
                return p;
            }
        }
        return null;
    }
    
    @GET
    @Path("{id}")
    public Produto getProduto(@PathParam("id") Integer id) {
        for (Produto p : produtos) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        return null;
    }

}
