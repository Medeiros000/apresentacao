interface IEmpregado {
    getSalario(): number;
    getBeneficios(): number;
}

class EmpregadoCLT implements IEmpregado {
    private readonly salario: number;

    constructor(salario: number) {
        this.salario = salario;
    }

    public getSalario(): number {
        return this.salario;
    }

    public getBeneficios(): number {
        return this.salario * 0.2;
    }
}

class EmpregadoPJ implements IEmpregado {
    private readonly salario: number;

    constructor(salario: number) {
        this.salario = salario;
    }

    public getSalario(): number {
        return this.salario;
    }

    public getBeneficios(): number {
        console.log("EmpregadoPJ não possui benefícios.");
        return 0;
    }
}

function main() {
    const empregadoPJ = new EmpregadoPJ(1000.00);
    console.log(`Empregado PJ`);
    console.log(`Salario: ${empregadoPJ.getSalario()}`);
    console.log(`Benefits: ${empregadoPJ.getBeneficios()}`);

    const empregadoCLT = new EmpregadoCLT(1000.00);
    console.log(`Empregado CLT`);
    console.log(`Salario: ${empregadoCLT.getSalario()}`);
    console.log(`Benefits: ${empregadoCLT.getBeneficios()}`);
}

main();