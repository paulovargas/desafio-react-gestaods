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

const StyledHead = styled.div`
  width: auto;
`;

//Define os estilos do campo de busca de pacientes
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

//Define os estilos globais do modal
const StyledModal = styled.div`
  width: auto;
  height: auto;
  top: 58px;
  left: 117px;
  border-radius: 10px;
`;

//Define os estilos globais do modal de opções na tabela
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

  .modalAcoes {
    --bs-btn-border-radius: none;
  }

  .btn-transparent {
    width: 100%;
    color: inherit;
    background-color: transparent;
  }

  .btn-transparent:hover {
    transition: box-shadow 0.3s ease;
    --bs-btn-hover-bg: #cadbf6;
  }
`;

//Define os estilos do logo
const StyledLogo = styled.img`
  width: 230px;
  height: 185px;
  display: block;
  margin: 0 auto;
`;

//Define os estilos da imagem dentro do modal de exclusão de paciente
const StyledImgDel = styled.img`
  width: 88px;
  height: 132px;
  display: block;
  margin: 0 auto;
`;

//Define os estilos globais do container do conteúdo
const StyledContainer = styled.div`
  justify-content: center;
  background: white;
  height: auto;
`;

//Define os estilos globais da tabela 
const StyledTable = styled.div`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 25px;
`;

//Define o estilo da imagem de usuário na aba informações básicas
const StyledAvatar = styled.img`
  width: 67.62px;
  height: 67.62px;
  top: 153px;
  left: 136px;
  justify-content: center;
`;

//Define o estilo do fundo da imagem de usuário
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

//Define os estilos globais do conteúdo apresentado em geral
const StyledPage = styled.div``;


//Define a url da api utilizada para salvar os dados da aplicação
const baseUrl = "https://6588390d90fa4d3dabf9a00f.mockapi.io/patients";


//Define o estado inicial da aplicação
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

//Define o corpo aplicação
export default class PacienteCrud extends Component {

  //Inicializa o estado da aplicação
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

  //Função que faz a consulta do cep na api indicada no teste
  searchCep = async () => {
    const { cep } = this.state.paciente;

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { data } = response;

      if (!data.erro) {
        const { logradouro, bairro, localidade, uf } = data;

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

  //Executa a busca de dados na api ao alterar o estado 
  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  //Função que abre o modal 
  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  //Função que fecha o modal e atualiza os estados de controle da aplicação
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

  //Função que limpa os campos do formulário
  clear() {
    this.setState({ paciente: initialState.paciente });
  }

  //Função que envia os dados para a api sendo novo cadastro ou cadastro quando atualizad
  salvaDados() {
    console.log("Dados: ", this.state.paciente);
    const paciente = this.state.paciente;
    const method = paciente.id ? "put" : "post"; // Aqui verifica se o paciente está sendo atualizado ou é cadastro novo
    const url = paciente.id ? `${baseUrl}/${paciente.id}` : baseUrl;
    axios[method](url, paciente).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ paciente: initialState.paciente, list });
    });
    this.handleCloseModal();
  }

  //Função que atualiza a tabela durante a busca no campo "Pequisar"
  getUpdatedList(paciente, add = true) {
    const list = this.state.list.filter((t) => t.id !== paciente.id);
    if (add) list.unshift(paciente);
    return list;
  }

  //Função que atualiza o estado "paciente"
  updateField(event) {
    const paciente = { ...this.state.paciente };
    paciente[event.target.name] = event.target.value;
    this.setState({ paciente });
  }

  //Função que busca o paciente preenchido no campo "Pesquisar"
  setBusca(e) {
    const pesqPaciente = e.toLowerCase();
    const listaPacientes = this.state.list;

    var pacientes = listaPacientes;
    function buscarPaciente(listaPacientes) {
      if (
        listaPacientes.paciente.toLowerCase().includes(pesqPaciente) || // Aqui é verificado se o nome do paciente existe
        listaPacientes.cpf.includes(pesqPaciente) // Aqui é verificado se o cpf do paciente existe
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

  //Função que rendeniza o cabeçalho da tabela
  cabecalhoTabela() {
    return (
      <StyledHead>
        <div className="row col-12 mt-5 flex-md-row flex-md-column justify-content-center">
          <div className="row ali">
            <div className="col-md-6 my-3">
              <label htmlFor="">Listagem de pacientes</label>
            </div>
            <div className="col-md-6 d-grid d-md-flex justity-content-end align-items-center">
              <StyledSearch> {/* Mostra o campo "pesquisar" */}
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

  //Função que rendeniza o formulário adicionar / editar paciente
  renderForm() {
    return (
      <div className="form" style={{ maxWidth: "800px" }}>
        {this.state.stageBasic || this.state.stageContact ? ( // Condicional para definir se o formulário é basico ou de contato
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

        {this.state.stageBasic ? (  // Condicional para definir se o formulário é basico ou de contato
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
                  <option value={'masculino'}>masculino</option>
                  <option value={'feminino'}>feminino</option>
                  <option value={'transgênero'}>transgênero</option>
                  <option value={'gênero neutro'}>gênero neutro</option>
                  <option value={'não-binário'}>não-binário</option>
                  <option value={'agênero'}>agênero</option>
                  <option value={'pangênero'}>pangênero</option>
                  <option value={'outro'}>outro</option>
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
                  <option value={'solteiro'} >solteiro</option>
                  <option value={'casado'} >casado</option>
                  <option value={'separado'} >separado</option>
                  <option value={'divorciado'} >divorciado</option>
                  <option value={'viúvo'} >viúvo</option>
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
          {this.state.stageBasic || this.state.stageContact ? ( // Condicional para definir se o formulário é basico ou de contato
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

  // Função que rendeniza os dados quando o modal está no estado para deletar paciente
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

  // Função que atualiza os estados para que o modal abra no modo edição de dados
  load(paciente) {
    this.setState({ crudMode: "edit" }),
    this.setState({ modalTitle: "" }),
    this.setState({ stageBasic: true }),
    this.setState({ stageContact: false }),
    this.setState({ newPaciente: false }),
    this.setState({ mostraLista: false }),
    this.setState({ paciente });

    this.handleOpenModal();
  }

  //Função que seta o paciente que será carregado no modal
  modalOption(pacienteId) {
    this.setState({ linhaSelecionada: pacienteId }),
      this.setState({ modalOpcoes: !this.state.modalOpcoes });
  }

  //Função que exclui o paciente selecionado
  remove(paciente) {
    axios.delete(`${baseUrl}/${paciente.id}`).then((resp) => {
      const list = this.getUpdatedList(paciente, false);
      this.setState({ list });
    });
    this.handleCloseModal();
  }

  //Função que define o modal para o modo de exclusão de paciente
  modalDelet(paciente) {
    this.setState({ paciente });
    this.setState({ crudMode: "delet" });
    this.setState({ modalTitle: "Excluir paciente ?" });
    this.handleOpenModal();
  }

  //Função que rendeniza a tabela de pacientes na página
  renderTable() {
    return (
      <div className="table-responsive">
        {this.state.mostraCadastrar ? this.cabecalhoTabela() : ""} {/* Condicional para mostra o cabeçalho da tabela */}

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

  //Função que rendeniza a lista de pacientes na tabela
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
                alignContent: "center",
                position: "absolute",
                overflow: "visible",
                top: "-20px",
                left: "0",
                height: "70px",
                zIndex: "1",
              }}
            >
              <div>
                <div className="btn-transparent btn-outline-primary">
                  <div
                    className="btn btn-link modalAcoes"
                    style={{ textDecoration: "none", width: "100%" }}
                    onClick={() => this.load(paciente)}
                  >
                    Editar
                  </div>
                </div>

                <div className="btn-transparent btn-outline-primary">
                  <div
                    className="btn btn-link modalAcoes"
                    style={{ textDecoration: "none", width: "100%" }}
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

  //Função que rendeniza a página
  render() {
    return (
      <Main >
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
                      {this.state.crudMode === "add" ? this.renderForm() : ""}  {/* Condicional que verifica se o modo é formulário é para novo paciente */}
                      {this.state.crudMode === "edit" ? this.renderForm() : ""} {/* Condicional que verifica se o modo é formulário é para editar paciente */}
                      {this.state.crudMode === "delet" ? this.renderDel() : ""} {/* Condicional que verifica se o modo é excluir paciente */}
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
