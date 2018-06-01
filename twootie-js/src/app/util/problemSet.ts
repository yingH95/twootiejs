export class ProblemSet {
    private predicateLogicProbs = [
            {   type: "PL",
                pid: 1,
                sentences: [
                    {line:1, sen:"Vx(Gxa>Lxa)", just:"/SM", br:0},
                    {line:2, sen:"Gca", just:"/SM", br:0},
                    {line:3, sen:"-Lca", just:"/SM", br:0},
                ]
            },{ type: "PL",
                pid: 2,
                sentences: [
                    {line:1, sen:"Vx(Cx>Lx)", just:"/SM", br:0},
                    {line:2, sen:"Vy(CyvDy)", just:"/SM", br:0},
                    {line:3, sen:"]x(-Lx)", just:"/SM", br:0},
                    {line:4, sen:"-(]x(Dx))", just:"/SM", br:0},
                ]
            },
            // { pid: 3, sentences: '' },
            // { pid: 4, sentences: '' },
            // { pid: 5, sentences: '' },
            // { pid: 6, sentences: '' },
            // { pid: 7, sentences: '' },
            // { pid: 8, sentences: '' },
            // { pid: 9, sentences: '' },
            // { pid: 10, sentences: '' }
    ];
    private sententialProbs = [
        {   type: "SL",
            pid: 1,
            sentences: [
                {line:1, sen:"((D&K)&J)", just:"/SM", br:0},
                {line:2, sen:"(L&P)", just:"/SM", br:0},
                {line:3, sen:"-(K&L)", just:"/SM", br:0}
            ]
        },
    ];

    public get allPlProbs() {
        return this.predicateLogicProbs;
    }

    public getSlProbId(pid: number){
        return this.sententialProbs.filter(
            prob => prob.pid === pid
        )[0];
    }

    public getPlProbId(pid: number){
        return this.predicateLogicProbs.filter(
            prob => prob.pid === pid
        )[0];
    }

    public hasProbWithId(pid: number, type: string){
        let obj = this.predicateLogicProbs.filter(
            prob => (prob.pid === pid && prob.type === type)
        );
        return (obj.length !== 0);
    }
}