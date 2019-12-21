interface SimuleAntecipacaoState {
  inputs: SimuleAntecipacaoInputs;
  outputs?: SimuleAntecipacaoOutputs;
}

export interface SimuleAntecipacaoInputs {
  valor_venda: number;
  parcelas: number;
  percentual: number;
}

export interface SimuleAntecipacaoOutputs {
  amanha: number;
  quinze_dias: number;
  trinta_dias: number;
  noventa_dias: number;
}

/**
 * Gerencia os estados da aplicação
 */
export class State {
  private static instance: State;

  private simule_antecipacao_state: SimuleAntecipacaoState;

  /**
   * seta constructor como privado para gerar erro na compilação se tentar se criada através de new State()
   */
  private constructor() {}

  /**
   * retorna única instancia de gerenciamento de estados
   */
  static getInstance() {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }

  /**
   * inicializa o estado
   * @returns {boolean}
   */
  public async init() {
    try {
      const simuleAntecipacaoState = await this.setSimuleAntecipacaoState({
        inputs: <SimuleAntecipacaoInputs>{
          valor_venda: undefined,
          parcelas: undefined,
          percentual: undefined
        }
      });
      return true;
    } catch (error) {
      return error;
    }
  }

  /**
   * Atualiza cálculos, valores e grava no estado da aplicação: simule antecipação
   * @param {SimuleAntecipacaoState} value  novos valores para o estado da aplicação, não é necessário passar outpu, será calculado
   */
  public async setSimuleAntecipacaoState(value: SimuleAntecipacaoState) {
    try {
      const inputs: SimuleAntecipacaoInputs = value.inputs;
      let outputs: SimuleAntecipacaoOutputs =
        value.outputs ||
        <SimuleAntecipacaoOutputs>{
          amanha: undefined,
          quinze_dias: undefined,
          trinta_dias: undefined,
          noventa_dias: undefined
        };
      if (this.inputsIsValid(inputs) === true) {
        outputs = this.calculateAntecipacao(inputs, outputs);
      }
      this.simule_antecipacao_state = { inputs, outputs };
      return this.simule_antecipacao_state;
    } catch (error) {
      return error;
    }
  }

  /**
   * Valida se pode executar os cálculos
   * @param {SimuleAntecipacaoInputs} inputs valores vindos do formulário do tipo
   */
  public inputsIsValid(inputs: SimuleAntecipacaoInputs): boolean {
    return (
      this.simule_antecipacao_state &&
      this.simule_antecipacao_state.inputs !== inputs &&
      inputs.parcelas &&
      inputs.parcelas > 0 &&
      inputs.parcelas < 13 &&
      inputs.percentual &&
      inputs.percentual > 0 &&
      inputs.percentual < 100 &&
      inputs.valor_venda &&
      inputs.valor_venda > 100
    );
  }

  /**
   * Calcula as antecipações nos outputs
   * @param {SimuleAntecipacaoInputs} input
   * @param {SimuleAntecipacaoOutputs} output
   */
  private calculateAntecipacao(
    input: SimuleAntecipacaoInputs,
    output: SimuleAntecipacaoOutputs
  ): SimuleAntecipacaoOutputs {
    output.amanha = this.antecipa(0, input);
    output.quinze_dias = this.antecipa(15, input);
    output.trinta_dias = this.antecipa(30, input);
    output.noventa_dias = this.antecipa(90, input);
    return output;
  }

  /**
   * calcula valor da antecipação
   * @param {number} dias dias correntes para a data de antecipação
   * @param {SimuleAntecipacaoInputs} input parâmetros de entrada da antecipação
   */
  private antecipa(dias: number, input: SimuleAntecipacaoInputs): number {
    const { valor_venda, parcelas, percentual } = input;
    let result = 0;
    const percentual_adiantamento = percentual / 100;
    const valor_liquido = valor_venda - valor_venda * percentual_adiantamento;
    const valor_parcela = valor_liquido / parcelas;
    for (let i = 1; i <= parcelas; i++) {
      const diasPrazo: number = i * 30;
      const diasAdiantamento: number = (diasPrazo - dias) / 30;
      const incremento: number = diasAdiantamento < 0 ? 0 : diasAdiantamento;
      const valorParcela: number =
        incremento === 0
          ? valor_parcela
          : valor_parcela -
            valor_parcela * (incremento * percentual_adiantamento);
      result += valorParcela;
    }
    return result;
  }
}

export default State;
