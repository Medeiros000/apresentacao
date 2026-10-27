// 1. A Interface Command
interface ICommand {
    execute(): void;
}

// 2. O Receptor (Receiver) - Contém a lógica de negócio real
class Luz {
    public ligar(): void {
        console.log("A luz está ACESA.");
    }

    public desligar(): void {
        console.log("A luz está APAGADA.");
    }
}

// 3. Comandos Concretos
class LigarLuzCommand implements ICommand {
    private readonly luz: Luz;

    constructor(luz: Luz) {
        this.luz = luz;
    }

    public execute(): void {
        this.luz.ligar();
    }
}

class DesligarLuzCommand implements ICommand {
    private readonly luz: Luz;

    constructor(luz: Luz) {
        this.luz = luz;
    }

    public execute(): void {
        this.luz.desligar();
    }
}

// 4. O Invocador (Invoker) - Dispara o comando
class ControleRemoto {
    private comando: ICommand | null = null;

    public setComando(comando: ICommand): void {
        this.comando = comando;
    }

    public pressionarBotao(): void {
        if (this.comando) {
            this.comando.execute();
        }
    }
}

// 5. Uso (Cliente)
function main() {
    // Criando o receptor
    const luzDaSala = new Luz();

    // Criando os comandos e associando ao receptor
    const ligar: ICommand = new LigarLuzCommand(luzDaSala);
    const desligar: ICommand = new DesligarLuzCommand(luzDaSala);

    // Criando o invocador
    const controle = new ControleRemoto();

    // Acionando para ligar a luz
    controle.setComando(ligar);
    controle.pressionarBotao(); // Saída: A luz está ACESA.

    // Acionando para desligar a luz
    controle.setComando(desligar);
    controle.pressionarBotao(); // Saída: A luz está APAGADA.
}

// Executando o programa
main();