import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "users",
  title: "Clientes",
  subtitle: "Cadastro de clientes: Incluir, Listar, Alterar e Excluir",
};

const baseUrl = "http://localhost:3001/clients";

const initialState = {
  client: { name: "", phone: "", email: "", cnpj: "" },
  list: [],
};

export default class ClientCrud extends Component {
  state = { ...initialState };

  /* componentWillMount() é chamado antes de render() para fazer uma requisição GET com a url do backend
   *  e obter como resposta do webservice (json-server) em resp.data a lista de clientes armazenados em db.json;
   *  Em seguida o estado do componente é setado com a lista de clientes */
  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  // clear() limpa o formulário
  clear() {
    this.setState({ client: initialState.client });
  }

  formVerify(client) {
    if (
      client.name !== "" &&
      client.cnpj !== "" &&
      client.email !== "" &&
      client.phone !== ""
    ) {
      return true;
    }
    return false;
  }

  /* save() cadastra um novo cliente através da requisição POST ou faz alterações através de PUT
   *  resp.data possui o cliente que será incluído ou alterado
   *  Em seguida atualiza a lista de clientes e limpa o formulário */
  save() {
    const client = this.state.client;
    if (this.formVerify(client)) {
      const method = client.id ? "put" : "post";
      const url = client.id ? `${baseUrl}/${client.id}` : baseUrl;
      axios[method](url, client).then((resp) => {
        const list = this.getUpdatedList(resp.data);
        this.setState({ client: initialState.client, list });
      });
    }
  }

  getUpdatedList(client) {
    const list = this.state.list.filter((c) => c.id !== client.id);
    list.unshift(client);
    return list;
  }

  // updateField() atualiza os campos do formulário
  updateField(event) {
    const client = { ...this.state.client };
    client[event.target.name] = event.target.value;
    this.setState({ client });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>Nome</b>
              </label>
              <input
                type="text"
                className="form-control"
                required
                name="name"
                value={this.state.client.name}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o nome:"
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>CNPJ</b>
              </label>
              <input
                type="text"
                className="form-control"
                required
                name="cnpj"
                value={this.state.client.cnpj}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o CNPJ:"
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>E-mail</b>
              </label>
              <input
                type="email"
                className="form-control"
                required
                name="email"
                value={this.state.client.email}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o email:"
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>Telefone</b>
              </label>
              <input
                type="text"
                className="form-control"
                required
                name="phone"
                value={this.state.client.phone}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o telefone:"
              />
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={(e) => this.save(e)}>
              Salvar
            </button>

            <button
              className="btn btn-secondary ml-2"
              onClick={(e) => this.clear(e)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // load() carrega um cliente para quando for realizar Alteração
  load(client) {
    this.setState({ client });
  }

  // remove() faz uma requisição DELETE para remover um cliente
  remove(client) {
    axios.delete(`${baseUrl}/${client.id}`).then((resp) => {
      const list = this.state.list.filter((c) => c !== client);
      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((client) => {
      return (
        <tr key={client.id}>
          <td>{client.id}</td>
          <td>{client.name}</td>
          <td>{client.cnpj}</td>
          <td>{client.email}</td>
          <td>{client.phone}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(client)}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(client)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
