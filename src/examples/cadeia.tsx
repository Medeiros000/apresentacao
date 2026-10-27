abstract class AtendenteSuporte {
    protected _proximoAtendente?: AtendenteSuporte;

    public setProximo(atendente: AtendenteSuporte): void {
        this._proximoAtendente = atendente;
    }

    public abstract processarPedido(nivelDificuldade: number): void;
}

class AtendenteJunior extends AtendenteSuporte {
    public processarPedido(nivelDificuldade: number): void {
        if (nivelDificuldade <= 1) {
            console.log("Atendente Junior processou o pedido.");
        } else if (this._proximoAtendente) {
            this._proximoAtendente.processarPedido(nivelDificuldade);
        }
    }
}

class TecnicoPleno extends AtendenteSuporte {
    public processarPedido(nivelDificuldade: number): void {
        if (nivelDificuldade <= 2) {
            console.log("Técnico Pleno processou o pedido.");
        } else if (this._proximoAtendente) {
            this._proximoAtendente.processarPedido(nivelDificuldade);
        }
    }
}

class ArquitetoSenior extends AtendenteSuporte {
    public processarPedido(nivelDificuldade: number): void {
        if (nivelDificuldade <= 3) {
            console.log("Arquiteto Senior processou o pedido.");
        } else if (this._proximoAtendente) {
            this._proximoAtendente.processarPedido(nivelDificuldade);
        }
    }
}

function main() {
    // Configuração da cadeia de responsabilidade
    const junior = new AtendenteJunior();
    const pleno = new TecnicoPleno();
    const senior = new ArquitetoSenior();

    junior.setProximo(pleno);
    pleno.setProximo(senior);

    // Testando a cadeia de responsabilidade
    junior.processarPedido(1);
    junior.processarPedido(2);
    junior.processarPedido(3);
}

// Executando o programa
main();