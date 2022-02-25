import React, { Component } from "react";
import Main from "../template/Main";

const headerProps = {
  icon: "users",
  title: "Clientes",
  subtitle: "Cadastro de clientes: Incluir, Listar, Alterar e Excluir"
}

export default class ClientCrud extends Component {
  render() {
    return (
      <Main {...headerProps}>
        Cadastro de Clientes
      </Main>
    )
  }
}
