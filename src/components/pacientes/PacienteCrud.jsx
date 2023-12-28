/* eslint-disable no-lone-blocks */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import axios from "axios";
import React, { Component } from "react";
import Main from "../template/Main";
import styled from "styled-components";
import { Box, Flex } from "rebass";
import logoImage from "../../assets/imgs/logo.png";
import deleteImage from "../../assets/imgs/Group 137.png";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import avatar from "../../assets/imgs/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const headerProps = {
  list: [],
};

const StyledHead = styled.div`
  width: auto;
  //display: flex;
  //flex-direction: row;
  //justify-content: end;
  //align-content: center;
  //margin-right: 70px;
  //padding: 30px;
  //border: 1px solid #ccc;
`;

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  width: auto;
  height: 40px;

  input {
    border: none;
    outline: none;
    margin-left: 15px;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const StyledModal = styled.div`
  width: auto;
  height: auto;
  top: 58px;
  left: 117px;
  border-radius: 10px;
`;

const StyledModalEdit = styled.div`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  width: auto;
  top: 373px;
  left: 1424px;
  border-radius: 5px;
  gap: 10px;
  border: 1px solid #ccc;
  background-color: white;
  align: center;

  .btn-transparent {
    width: 100%;
    --bs-btn-border-radius: none;
    color: inherit;
    background-color: transparent;
  }

  .btn-transparent:hover {
    transition: box-shadow 0.3s ease;
    --bs-btn-hover-bg: #cadbf6;
  }
`;

const StyledLogo = styled.img`
  width: 230px;
  height: 185px;
  display: block; /* Remove espaços em branco extras em torno da imagem */
  margin: 0 auto; /* Centraliza horizontalmente */
`;

const StyledImgDel = styled.img`
  width: 88px;
  height: 132px;
  display: block; /* Remove espaços em branco extras em torno da imagem */
  margin: 0 auto; /* Centraliza horizontalmente */
`;

const StyledContainer = styled.div`
  justify-content: center;
  background: white;
  height: auto;
`;

const StyledTable = styled.div`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 25px;
  //margin-right: 70px;
`;

const StyledAvatar = styled.img`
  width: 67.62px;
  height: 67.62px;
  top: 153px;
  left: 136px;
  justify-content: center;
`;

const StyledElipse = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 125px;
  height: 125px;
  top: 153px;
  left: 136px;
  border-radius: 50%;
  background: #d9d9d9;
`;

const StyledPage = styled.div``;

const baseUrl = "https://6588390d90fa4d3dabf9a00f.mockapi.io/patients";

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
    crudMode: "add",
    modalTitle: "",
    labelBasic: "#510972",
    labelContact: "",
    basicBold: "bold",
    contactBold: "",
  };

  searchCep = async () => {
    const { cep } = this.state.paciente;

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { data } = response;

      if (!data.erro) {
        const { logradouro, bairro, localidade, uf } = data;

        // Atualiza os campos de endereço no estado
        this.setState((prevState) => ({
          paciente: {
            ...prevState.paciente,
            endereco: logradouro,
            bairro: bairro,
            cidade: localidade,
            uf: uf,
          },
        }));
      } else {
        window.alert("CEP não encontrado");
      }
    } catch (error) {
      window.alert("Erro ao buscar CEP", error);
    }
  };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    this.setState({
      labelBasic: "#510972",
      labelContact: "",
      basicBold: "bold",
      contactBold: "",
    });
    this.clear();
  };

  clear() {
    this.setState({ paciente: initialState.paciente });
  }

  save() {
    this.state.resVerifica ? this.salvaDados() : "";
  }

  salvaDados() {
    console.log("Dados: ", this.state.paciente);
    const paciente = this.state.paciente;
    const method = paciente.id ? "put" : "post";
    const url = paciente.id ? `${baseUrl}/${paciente.id}` : baseUrl;
    axios[method](url, paciente).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ paciente: initialState.paciente, list });
    });
    this.handleCloseModal();
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
        listaPacientes.paciente.toLowerCase().includes(pesqPaciente) ||
        listaPacientes.cpf.includes(pesqPaciente)
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
      <StyledHead>
        <div className="row col-12 mt-5 flex-md-row flex-md-column justify-content-center">
          <div className="row ali">
            <div className="col-md-6 my-3">
              <label htmlFor="">Listagem de pacientes</label>
            </div>
            <div className="col-md-6 d-grid d-md-flex justity-content-end align-items-center">
              <StyledSearch>
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ marginLeft: "15px" }}
                />
                <input
                  type="text"
                  className="form-control border-0 my-3"
                  value={this.pesqPaciente}
                  onChange={(e) => this.setBusca(e.target.value)}
                  placeholder="Pesquisar"
                />
              </StyledSearch>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary mx-3 my-3"
                  onClick={() =>
                    this.setState({
                      stageBasic: true,
                      stageContact: false,
                      showModal: true,
                      crudMode: "add",
                      modalTitle: "",
                      newPaciente: true,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faPlus} className="mx-2" />
                  Adicionar paciente
                </button>
              </div>
            </div>
          </div>
        </div>
      </StyledHead>
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
      <div className="form" style={{ maxWidth: "800px" }}>
        {this.state.stageBasic || this.state.stageContact ? (
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label
                  className="col-form-label"
                  style={{
                    color: this.state.labelBasic,
                    fontWeight: this.state.basicBold,
                  }}
                  onClick={() =>
                    this.setState({
                      stageBasic: true,
                      stageContact: false,
                      labelBasic: "#510972",
                      labelContact: "",
                      basicBold: "bold",
                      contactBold: "",
                    })
                  }
                >
                  Informações básicas{" "}
                </label>
                <label
                  className="mx-2"
                  style={{
                    color: this.state.labelContact,
                    fontWeight: this.state.contactBold,
                  }}
                  onClick={() =>
                    this.setState({
                      stageBasic: false,
                      stageContact: true,
                      labelBasic: "",
                      labelContact: "#510972",
                      basicBold: "",
                      contactBold: "bold",
                    })
                  }
                >
                  Contato{" "}
                </label>
              </div>
            </div>
            <hr />
          </div>
        ) : (
          ""
        )}

        {this.state.stageBasic ? (
          <div className="row">
            <div>
              <StyledElipse>
                <StyledAvatar src={avatar} alt="Logo" />
              </StyledElipse>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Paciente</label>
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
                <label className="col-form-label">Apelido</label>
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
                <label className="col-form-label">Nacionalidade</label>

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
                <label className="col-form-label">Nascimento</label>

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
                <label className="col-form-label">CPF</label>
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
                <label className="col-form-label">RG</label>

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
                <label className="col-form-label">Gênero</label>
                <select
                  type="text"
                  className="form-control"
                  name="genero"
                  value={this.state.paciente.genero}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                >
                  <option selected>Sem filtro</option>
                  <option>masculino</option>
                  <option>feminino</option>
                  <option>transgênero</option>
                  <option>gênero neutro</option>
                  <option>não-binário</option>
                  <option>agênero</option>
                  <option>pangênero</option>
                  <option>outro</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Estado civil</label>
                <select
                  type="text"
                  className="form-control"
                  name="estadoCivil"
                  value={this.state.paciente.estadoCivil}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                >
                  <option selected>Sem filtro</option>
                  <option>solteiro</option>
                  <option>casado</option>
                  <option>separado</option>
                  <option>divorciado</option>
                  <option>viúvo</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="form-group">
                <label className="col-form-label">Observações adicionais</label>

                <textarea
                  type="text"
                  className="form-control"
                  name="infoAdic"
                  value={this.state.paciente.infoAdic}
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

        {this.state.stageContact ? (
          <div className="row">
            <div className="col-12">
              <div className="form-group"></div>
            </div>

            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">CEP</label>
                <input
                  type="text"
                  className="form-control"
                  name="cep"
                  value={this.state.paciente.cep}
                  onChange={(e) => this.updateField(e)}
                  onBlur={this.searchCep}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Cidade</label>
                <input
                  type="text"
                  className="form-control"
                  name="cidade"
                  value={this.state.paciente.cidade}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">UF</label>

                <input
                  type="text"
                  className="form-control"
                  name="uf"
                  value={this.state.paciente.uf}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Endereço</label>

                <input
                  type="text"
                  className="form-control"
                  name="endereco"
                  value={this.state.paciente.endereco}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Número</label>
                <input
                  type="text"
                  className="form-control"
                  name="numero"
                  value={this.state.paciente.numero}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Bairro</label>

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
                <label className="col-form-label">Complemento</label>

                <input
                  type="text"
                  className="form-control"
                  name="complemento"
                  value={this.state.paciente.complemento}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite"
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label className="col-form-label">Email</label>

                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={this.state.paciente.email}
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
            <div className="col-12 d-flex justify-content-end mt-5 p-3">
              <button
                className="btn btn-primary"
                style={{ width: "200px" }}
                onClick={() => {
                  this.state.stageBasic
                    ? this.setState({
                        stageBasic: false,
                        stageContact: true,
                        labelBasic: "",
                        labelContact: "#510972",
                        basicBold: "",
                        contactBold: "bold",
                      })
                    : this.salvaDados();
                }}
              >
                {this.state.stageContact ? "Salvar" : "Próximo"}
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }

  renderDel() {
    return (
      <div className="form">
        <div className="col-12">
          <div className="text-center d-flex flex-column align-items-center">
            <StyledImgDel src={deleteImage} alt="Deletar" />
            <label className="text-center mt-5 my-1">
              Tem certeza que deseja excluir o paciente selecionado?
            </label>
            <label className="text-center fw-bold my-4">
              Essa ação não poderá ser desfeita.
            </label>
          </div>
          <div className="row">
            <hr />
            <div className="col-12 d-flex justify-content-end">
              <button
                className="btn btn-outline-primary mx-3"
                onClick={() => {
                  this.handleCloseModal();
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  this.remove(this.state.paciente);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  verificaCodigo() {
    const novoCod = this.state.paciente.codPaciente;
    const listaPacientes = this.state.list;
    for (let i = 0; i < listaPacientes.length; ++i) {
      if (novoCod === listaPacientes[i].codPaciente) {
        this.setState({ resVerifica: false });
        i = listaPacientes.length;
        window.alert("Existe outro paciente com esse código");
      } else this.setState({ resVerifica: false });
    }
    this.save();
  }

  load(paciente) {
    this.setState({ crudMode: "edit" });
    this.setState({ modalTitle: "" });
    this.setState({ stageBasic: true }),
      this.setState({ stageContact: false }),
      this.setState({ newPaciente: false }),
      this.setState({ mostraLista: false }),
      this.setState({ paciente });

    const listaCidades = this.state.listCidades;

    function cidadeDoPaciente(value) {
      if (value.id === paciente.cityId) {
        return value;
      }
    }

    const cidadePaciente = listaCidades.filter(cidadeDoPaciente);

    cidadePaciente.forEach((e) => {
      e;
      this.setState({ cidadePaciente: e });
    });

    this.handleOpenModal();
  }

  modalOption(pacienteId) {
    this.setState({ linhaSelecionada: pacienteId }),
      this.setState({ modalOpcoes: !this.state.modalOpcoes });
  }

  loadCidade(cidade) {
    this.setState({ cidadePaciente: cidade });
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
    this.handleCloseModal();
  }

  modalDelet(paciente) {
    this.setState({ paciente });
    this.setState({ crudMode: "delet" });
    this.setState({ modalTitle: "Excluir paciente ?" });
    this.handleOpenModal();
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
      <div className="table-responsive">
        {this.state.mostraCadastrar ? this.botaoCadastro() : ""}

        <table
          className="table mb-5"
          onClick={() =>
            this.setState({ modalOpcoes: !this.state.modalOpcoes })
          }
        >
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
            <tr>
              <th className="d-none d-md-table-cell fw-bold" scope="col">
                Nome
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  style={{
                    transform: "rotate(90deg)",
                    marginLeft: 10,
                    color: "blue",
                  }}
                />
              </th>

              <th className="d-none d-md-table-cell fw-bold" scope="col">
                CPF
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  style={{
                    transform: "rotate(90deg)",
                    marginLeft: 10,
                    color: "blue",
                  }}
                />
              </th>
              <th className="d-none d-md-table-cell fw-bold" scope="col">
                Data de Nascimento
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  style={{
                    transform: "rotate(90deg)",
                    marginLeft: 10,
                    color: "blue",
                  }}
                />
              </th>
              <th className="d-none d-md-table-cell fw-bold" scope="col">
                Email
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  style={{
                    transform: "rotate(90deg)",
                    marginLeft: 10,
                    color: "blue",
                  }}
                />
              </th>
              <th className="d-none d-md-table-cell fw-bold" scope="col">
                Cidade
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  style={{
                    transform: "rotate(90deg)",
                    marginLeft: 10,
                    color: "blue",
                  }}
                />
              </th>
              <th className="d-none d-md-table-cell fw-bold" scope="col">
                Ações
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  style={{
                    transform: "rotate(90deg)",
                    marginLeft: 10,
                    color: "blue",
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>
      </div>
    );
  }

  renderRows() {
    return this.state.list.map((paciente) => {
      return (
        <tr key={paciente.id} className="my-0">
          <td className="d-sm-table-cell">{paciente.paciente}</td>
          <td className="d-none d-md-table-cell">{paciente.cpf}</td>
          <td className="d-none d-md-table-cell">{paciente.dataNascimento}</td>
          <td className="d-none d-md-table-cell">{paciente.email}</td>
          <td className="d-none d-md-table-cell">{paciente.cidade}</td>

          <td style={{ position: "relative" }} className="d-md-table-cell">
            <p onClick={() => this.modalOption(paciente.id)}>...</p>
            <StyledModalEdit
              isVisible={
                this.state.modalOpcoes &&
                this.state.linhaSelecionada === paciente.id
              }
              style={{
                alignContent:"center",
                position: "absolute",
                overflow: "visible",
                top: "-20px", // Ajuste conforme necessário (um valor negativo move o modal para cima)
                left: "0",
                height: "70px", // Ajuste conforme necessário
                zIndex: "1", // Certifica-se de que o modal esteja acima da tabela
              }}
            >
              <div className="mt-3">
                <div className="btn-transparent btn-outline-primary btn-no-radius">
                <div 
                  className="btn btn-link btn-no-radius"
                  style={{ textDecoration: 'none', width: '100%'}}                  
                  onClick={() => this.load(paciente)}
                >
                  Editar 
                </div>
                </div>
                
                <div className="btn-transparent btn-outline-primary btn-no-radius">
                <div
                  className="btn btn-link btn-no-radius"
                  style={{ textDecoration: 'none', width: '100%'}}
                  onClick={() => this.modalDelet(paciente)}
                  >
                    Excluir
                  </div>
                </div>              
              </div>
            </StyledModalEdit>
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
        <Flex justifyContent="center" bg="#F6F6F6">
          <Box flexDirection={"column"} minHeight={665} width={1032}>
            <StyledLogo src={logoImage} alt="Logo" />
            <StyledContainer>
              <StyledPage>
                <StyledTable>{this.renderTable()}</StyledTable>
                <StyledModal>
                  <Modal
                    show={this.state.showModal}
                    onHide={this.handleCloseModal}
                    dialogClassName="modal-lg"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title color="#510972">
                        {this.state.modalTitle}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {this.state.crudMode === "add" ? this.renderForm() : ""}
                      {this.state.crudMode === "edit" ? this.renderForm() : ""}
                      {this.state.crudMode === "delet" ? this.renderDel() : ""}
                      {this.state.crudMode === "delet" ? "" : ""}
                    </Modal.Body>
                  </Modal>
                </StyledModal>
              </StyledPage>
            </StyledContainer>
          </Box>
        </Flex>
      </Main>
    );
  }
}
