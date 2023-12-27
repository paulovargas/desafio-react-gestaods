import axios from "axios";
import React, { Component } from "react";
import Main from "../template/Main";
import styled from "styled-components";
import { Box, Flex } from "rebass";
import logoImage from "../../assets/imgs/logo.png";

const headerProps = {
  list: [],
};

const StyledLogo = styled.img`
  width: 230px;
  height: 185px;
  display: block; /* Remove espaços em branco extras em torno da imagem */
  margin: 0 auto; /* Centraliza horizontalmente */
`;

const StyledContainer = styled.div`
  justify-content: center;
  background: white;
`;

const StyledTable = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 25px;
  margin-right: 70px;
`;

const StyledPage = styled.div``;

const baseUrlCidades = "https://6282b7eb92a6a5e46218f315.mockapi.io/cidades";
//const baseUrlCidades = "http://localhost:3001/cidades";

const baseUrl = "https://6588390d90fa4d3dabf9a00f.mockapi.io/patients";
//const baseUrl = "http://localhost:3001/pacientes";

const initialState = {
  paciente: {
    id: parseInt(""),
    paciente: "",
    apelido: "",
    nacionalidade: "",
    dataNascimento: "",
    cpf: "",
    rg: "",
    genero: "",
    estadoCivil: "",
    email: "",
    infoAdic: "",
    cep: "",
    cidade: "",
    uf: "",
    endereco: "",
    numero: "",
    bairro: "",
    complemento: "",
  },

  cidade: {
    id: parseInt(""),
    codCidade: parseInt(),
    nomeCidade: "",
    uF: "",
  },

  cidadePaciente: {
    id: parseInt(""),
    codCidade: parseInt(),
    nomeCidade: "",
    uF: "",
  },

  busca: {
    buscaPaciente: "",
  },

  list: [],

  listCidades: [],
};

export default class PacienteCrud extends Component {
  state = {
    ...initialState,
    stageBasic: false,
    stageContact: false,
    mostraLista: true,
    mostraListaCidades: false,
    mostraCadastrar: true,
    novoCadastro: false,
    salvarDados: false,
    pesqPaciente: "",
    cidadePaciente: "",
    resVerifica: false,
    newPaciente: false,
  };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
    axios(baseUrlCidades).then((resp) => {
      this.setState({ listCidades: resp.data });
    });
  }

  clear() {
    this.setState({ paciente: initialState.paciente });
  }

  save() {
    this.state.resVerifica ? this.salvaDados() : "";
  }

  salvaDados() {
    const paciente = this.state.paciente;
    const method = paciente.id ? "put" : "post";
    const url = paciente.id ? `${baseUrl}/${paciente.id}` : baseUrl;
    axios[method](url, paciente).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ paciente: initialState.paciente, list });
    });
    this.setState({ stageBasic: !this.state.stageBasic });
    this.setState({ mostraCadastrar: !this.state.mostraCadastrar });
    this.setState({ mostraLista: !this.state.mostraLista });
  }

  getUpdatedList(paciente, add = true) {
    const list = this.state.list.filter((t) => t.id !== paciente.id);
    if (add) list.unshift(paciente);
    return list;
  }

  updateField(event) {
    const paciente = { ...this.state.paciente };
    paciente[event.target.name] = event.target.value;
    this.setState({ paciente });
  }
  updateProgress = (field, val) => {
    this.setState({ [field]: val });
  };

  setBusca(e) {
    const pesqPaciente = e.toLowerCase();
    const listaPacientes = this.state.list;

    var pacientes = listaPacientes;
    function buscarPaciente(listaPacientes) {
      if (
        listaPacientes.nomePaciente.toLowerCase().includes(pesqPaciente) ||
        listaPacientes.codPaciente.includes(pesqPaciente)
      ) {
        return listaPacientes;
      }
    }
    var pesquisado = pacientes.filter(buscarPaciente);
    this.setState({ list: pesquisado });
    if (!pesqPaciente) {
      this.componentWillMount();
    }
  }

  botaoCadastro() {
    return (
      <div className="row col-12 align-items-center ">
        <div className="col-6 ml-auto">
          <label htmlFor="">Listagem de pacientes</label>
        </div>
        
        <div className="d-flex col-6 justify-content-end">
          <input
            type="text"
            className="form-control"
            value={this.pesqPaciente}
            onChange={(e) => this.setBusca(e.target.value)}
            placeholder="Pesquisar"
          />
          <button
            className="btn btn-primary mx-2"
            onClick={() =>
              this.setState({
                stageBasic: !this.state.stageBasic,
                mostraLista: !this.state.mostraLista,
                mostraCadastrar: !this.state.mostraCadastrar,
                newPaciente: !this.state.newPaciente,
              })
            }
          >
            Adicionar paciente
          </button>
        </div>
      </div>
    );
  }

  buscaCidade() {
    this.setState({
      stageBasic: !this.state.stageBasic,
      mostraListaCidades: !this.state.mostraListaCidades,
    });
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
          </tr>
        </thead>

        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderForm() {
    return (
      <div className="form">
        {this.state.mostraCadastrar ? this.botaoCadastro() : ""}
        {this.state.stageBasic || this.state.stageContact ? (
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label
                  className="mx-2"
                  onClick={() =>
                    this.setState({
                      stageBasic: !this.state.stageBasic,
                      stageContact: !this.state.stageContact,
                    })
                  }
                >
                  Informações básicas{" "}
                </label>
                <label
                  className="mx-2"
                  onClick={() =>
                    this.setState({
                      stageBasic: !this.state.stageBasic,
                      stageContact: !this.state.stageContact,
                    })
                  }
                >
                  Contato{" "}
                </label>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {this.state.stageBasic ? (
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label className="mx-2">Informações básicas </label>
                <label className="mx-2">___________________ </label>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Paciente</label>
                <input
                  type="text"
                  className="form-control"
                  name="paciente"
                  value={this.state.paciente.paciente}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Apelido</label>
                <input
                  type="text"
                  className="form-control"
                  name="apelido"
                  value={this.state.paciente.apelido}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Nacionalidade</label>

                <input
                  type="text"
                  className="form-control"
                  name="nacionalidade"
                  value={this.state.paciente.nacionalidade}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Nascimento</label>

                <input
                  type="date"
                  className="form-control"
                  name="dataNascimento"
                  value={this.state.paciente.dataNascimento}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>CPF</label>
                <input
                  type="text"
                  className="form-control"
                  name="cpf"
                  value={this.state.paciente.cpf}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>RG</label>

                <input
                  type="text"
                  className="form-control"
                  name="rg"
                  value={this.state.paciente.rg}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Gênero</label>
                <select
                  type="text"
                  className="form-control"
                  name="genero"
                  value={this.state.paciente.genero}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                >
                  <option selected>Sem filtro</option>
                  <option>...</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Estado civil</label>
                <select
                  type="text"
                  className="form-control"
                  name="estadoCivil"
                  value={this.state.paciente.estadoCivil}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                >
                  <option selected>Sem filtro</option>
                  <option>...</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="form-group">
                <label>Observações adicionais</label>

                <textarea
                  type="text"
                  className="form-control"
                  name="bairro"
                  value={this.state.paciente.infoAdic}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>

            {/* <div className="col">
              <div className="form-group">
                <label className="mx-2">Município</label>
                <IconButton
                  style="info"
                  icon="search"
                  onClick={() => this.buscaCidade()}
                ></IconButton>
                <input
                  icon="search"
                  type="text"
                  className="form-control"
                  placeholder="Município"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Estado</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Estado"
                />
              </div>
            </div> */}
            <div className="col-12 col-md-6">
              <div className="form-group">
                {/* <input
                  type="hidden"
                  className="form-control"
                  name="cityId"
                  value={this.state.cidadeCliente.id}
                  onChange={
                    (this.state.paciente.cityId = this.state.cidadeCliente.id)
                  }
                  placeholder={this.state.cidadeCliente.id}
                /> */}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {this.state.stageContact ? (
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label className="mx-2">Contato </label>
                <label className="mx-2">_______ </label>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>CEP</label>
                <input
                  type="text"
                  className="form-control"
                  name="codCliente"
                  value={this.state.paciente.cep}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  className="form-control"
                  name="codCliente"
                  value={this.state.paciente.cidade}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>UF</label>

                <input
                  type="text"
                  className="form-control"
                  name="nomeCliente"
                  value={this.state.paciente.uf}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Endereço</label>

                <input
                  type="text"
                  className="form-control"
                  name="dataNascimento"
                  value={this.state.paciente.endereco}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Número</label>
                <input
                  type="text"
                  className="form-control"
                  name="numEnde"
                  value={this.state.paciente.numero}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Bairro</label>

                <input
                  type="text"
                  className="form-control"
                  name="bairro"
                  value={this.state.paciente.bairro}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label>Complemento</label>

                <input
                  type="text"
                  className="form-control"
                  name="bairro"
                  value={this.state.paciente.complemento}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group"></div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="row">
          {this.state.stageBasic || this.state.stageContact ? (
            <div className="col-12 d-flex justify-content-end p-5">
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.state.stageBasic
                    ? this.setState({
                        stageBasic: !this.state.stageBasic,
                        stageContact: !this.state.stageContact,
                      })
                    : (e) => this.salvaDados(e);
                }}
              >
                {this.state.stageContact ? "Salvar" : "Próximo"}
              </button>

             
            </div>
          ) : (
            <div></div>
          )}
          {this.state.mostraLista ? this.renderTable() : ""}
          {this.state.mostraListaCidades ? this.renderTableCidades() : ""}
        </div>
      </div>
    );
  }

  //Modal Informações

  verificaCodigo() {
    const novoCod = this.state.paciente.codPaciente;
    const listaPacientes = this.state.list;
    for (let i = 0; i < listaPacientes.length; ++i) {
      if (novoCod === listaPacientes[i].codPaciente) {
        this.state.resVerifica = false;
        i = listaPacientes.length;
        window.alert("Existe outro paciente com esse código");
      } else this.state.resVerifica = true;
    }
    this.save();
  }

  load(paciente) {
    const listaCidades = this.state.listCidades;

    function cidadeDoPaciente(value) {
      if (value.id === paciente.cityId) {
        return value;
      }
    }
    const cidadePaciente = listaCidades.filter(cidadeDoPaciente);
    cidadePaciente.forEach((e) => {
      e;
      this.state.cidadePaciente = e;
    });

    this.setState({ stageBasic: !this.state.stageBasic }),
      this.setState({ newPaciente: false }),
      this.setState({ mostraLista: !this.state.mostraLista }),
      this.setState({ mostraCadastrar: false }),
      this.setState({ paciente });
  }

  loadCidade(cidade) {
    this.state.cidadePaciente = cidade;
    this.setState({
      stageBasic: !this.state.stageBasic,
      mostraListaCidades: !this.state.mostraListaCidades,
    });
  }

  remove(paciente) {
    axios.delete(`${baseUrl}/${paciente.id}`).then((resp) => {
      const list = this.getUpdatedList(paciente, false);

      this.setState({ list });
    });
  }

  renderTableCidades() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Município</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>{this.renderRowsCidade()}</tbody>
      </table>
    );
  }
  renderTable() {
    return (
      <table className="table mt-3 mx-5">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">CPF</th>
            <th scope="col">Data de Nascimento</th>
            <th scope="col">Email</th>
            <th scope="col">Cidade</th>
            <th scope="col">Ações</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((paciente) => {
      return (
        <tr key={paciente.id}>
          <td onClick={() => this.load(paciente)}>{paciente.paciente}</td>
          <td onClick={() => this.load(paciente)}>{paciente.cpf}</td>
          <td onClick={() => this.load(paciente)}>{paciente.dataNascimento}</td>
          <td onClick={() => this.load(paciente)}>{paciente.email}</td>
          <td onClick={() => this.load(paciente)}>{paciente.cidade}</td>

          <td>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(paciente)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  renderRowsCidade() {
    return this.state.listCidades.map((cidade) => {
      return (
        <tr key={cidade.id} onClick={() => this.loadCidade(cidade)}>
          <td>{cidade.codCidade}</td>
          <td>{cidade.nomeCidade}</td>
          <td>{cidade.uF}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        <Flex justifyContent="center" p={4} bg="#F6F6F6" minHeight="100vh">
          <Box flexDirection={"column"} minHeight={825} width={1032}>
            <StyledLogo src={logoImage} alt="Logo" />
            <StyledContainer>
              <StyledPage>
                <StyledTable></StyledTable>
                {this.renderForm()}
              </StyledPage>
            </StyledContainer>
          </Box>
        </Flex>
      </Main>
    );
  }
}
