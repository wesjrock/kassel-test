import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "users",
  title: "Clientes",
  subtitle: "Cadastro de clientes: Incluir, Listar, Alterar e Excluir"
}

const baseUrl = "http://localhost:3001/clients";

const initialState = {
  client: { name: "", phone: "", email: "", cnpj: "" },
  list: []
}

export default class ClientCrud extends Component {
  
  state = { ...initialState }

  componentWillMount() {
    axios(baseUrl).then(resp => {
      this.setState({ list: resp.data })
    })
  }

  clear() {
    this.setState( {client: initialState.client} )
  }

  save() {
    const client = this.state.client;
    const method = client.id ? 'put' : 'post';
    const url = client.id ? `${baseUrl}/${client.id}` : baseUrl;
    axios[method](url, client)
      .then(resp => {
        const list = this.getUpdatedList(resp.data);
        this.setState({ client: initialState.client, list})
      })
  }

  getUpdatedList(client) {
    const list = this.state.list.filter(c => c.id !== client.id);
    list.unshift(client);
    return list;
  }

  updateField(event) {
    const client = { ...this.state.client }
    client[event.target.name] = event.target.value;
    this.setState({ client });
  }

  renderForm() {
    return(
      <div className="form">
        <div className="row">          
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Nome</label>
              <input type="text" className="form-control"
                name="name"
                value={this.state.client.name}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Telefone</label>
              <input type="text" className="form-control"
                name="phone"
                value={this.state.client.phone}
                onChange={e => this.updateField(e)}
                placeholder="Digite o telefone:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>E-mail</label>
              <input type="text" className="form-control"
                name="email"
                value={this.state.client.email}
                onChange={e => this.updateField(e)}
                placeholder="Digite o email:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>CNPJ</label>
              <input type="text" className="form-control"
                name="cnpj"
                value={this.state.client.cnpj}
                onChange={e => this.updateField(e)}
                placeholder="Digite o CNPJ:" />
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary"
              onClick={e => this.save(e)}>
              Salvar
            </button>

            <button className="btn btn-secondary ml-2"
              onClick={e => this.clear(e)}>
              Cancelar
            </button>
          </div>
        </div>

      </div>
    )
  }

  load(client) {
    this.setState({ client });
  }

  remove(client) {
    axios.delete(`${baseUrl}/${client.id}`).then(resp => {
      const list = this.state.list.filter(c => c !== client)
      this.setState({ list });
    })
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>CNPJ</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    return this.state.list.map(client => {
      return (
        <tr key={client.id}>
          <td>{client.id}</td>
          <td>{client.name}</td>
          <td>{client.phone}</td>
          <td>{client.email}</td>
          <td>{client.cnpj}</td>
          <td>
            <button className="btn btn-warning"
              onClick={() => this.load(client)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button className="btn btn-danger ml-2"
              onClick={() => this.remove(client)}>
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      )
    })
  }
  
  render() {    
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    )
  }
}
