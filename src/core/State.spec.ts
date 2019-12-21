import { State } from "./State";

const stringSnap =
  '{"inputs":{"valor_venda":150,"parcelas":3,"percentual":4},"outputs":{"amanha":132.48,"quinze_dias":135.36,"trinta_dias":138.24,"noventa_dias":144}}';

describe("test suite for State", () => {
  const state = State.getInstance();
  it("valida singletone", () => {
    expect(state !== undefined).toBeTruthy();
    //expect(new State()).toThrowError();
  });
  it("valida inicialização", async () => {
    const init = await state.init();
    expect(init).toBe(true);
  });
  it("valida calculo de adiantamento", async () => {
    const inputs = {
      valor_venda: 150,
      parcelas: 3,
      percentual: 4
    };
    const outputs = {
      amanha: 132.48,
      noventa_dias: 144,
      quinze_dias: 135.36,
      trinta_dias: 138.24
    };
    let newState = await state.setSimuleAntecipacaoState({ inputs: inputs });
    expect(newState.outputs).toEqual(outputs);
    const inputs2 = {
      valor_venda: 300,
      parcelas: 3,
      percentual: 4
    };
    const outputs2 = {
      amanha: 132.48 * 2,
      noventa_dias: 144 * 2,
      quinze_dias: 135.36 * 2,
      trinta_dias: 138.24 * 2
    };
    newState = await state.setSimuleAntecipacaoState({ inputs: inputs2 });
    expect(newState.outputs).toEqual(outputs2);
  });
});
