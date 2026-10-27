class ContaBancaria {
    // 1. Atributo privado: o dado está escondido e protegido aqui dentro
    private saldo: number;

    // Construtor para abrir a conta com um valor inicial
    constructor(saldoInicial: number) {
        if (saldoInicial >= 0) {
            this.saldo = saldoInicial;
        } else {
            this.saldo = 0;
        }
    }

    // 2. Método público para depositar (com validação)
    public depositar(valor: number): void {
        if (valor > 0) {
            this.saldo += valor;
            console.log(`Depósito de R$ ${valor.toFixed(2)} realizado.`);
        }
    }

    // 3. Método público para sacar (impede saldo negativo)
    public sacar(valor: number): void {
        if (valor > 0 && valor <= this.saldo) {
            this.saldo -= valor;
            console.log(`Saque de R$ ${valor.toFixed(2)} realizado.`);
        } else {
            console.log("Operação negada: Saldo insuficiente ou valor inválido!");
        }
    }

    // 4. Método público apenas para consultar o saldo (leitura segura)
    public obterSaldo(): number {
        return this.saldo;
    }
}

// Uso (Cliente)
function main() {
    // Criando a conta com R$ 100,00
    const minhaConta = new ContaBancaria(100);

    // ERRO DE COMPILAÇÃO SE TENTAR ISSO:
    // minhaConta.saldo = 1000000; 
    // O TypeScript proíbe porque o atributo é privado!

    // Usamos as portas oficiais (métodos públicos)
    minhaConta.depositar(50);   // Saldo vai para 150
    minhaConta.sacar(200);      // Vai barrar (saldo insuficiente)
    minhaConta.sacar(30);       // Funciona (saldo vai para 120)

    console.log(`Saldo final na tela: R$ ${minhaConta.obterSaldo().toFixed(2)}`);
}

main();