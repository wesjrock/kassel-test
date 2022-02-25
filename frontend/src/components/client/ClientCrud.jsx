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
  
  render() {
    return (
      <Main {...headerProps}>
        Cadastro de Clientes
      </Main>
    )
  }
}
