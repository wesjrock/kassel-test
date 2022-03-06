import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "video-camera",
  title: "Videos",
  subtitle: "Cadastro de videos: Incluir, Listar, Alterar e Excluir",
};

const baseUrl = "http://localhost:3001/videos";
const clientsUrl = "http://localhost:3001/clients";

const initialState = {
  video: {
    title: "",
    briefing: "",
    price: "",
    delivery_date: "",
    status: "Pendente",
    client_id: "",
  },
  list: [],
};

export default class VideoCrud extends Component {
  state = { ...initialState };

  clientList = [];

  componentWillMount() {
    this.loadVideosData();
  }

  loadVideosData = async () => {
    return await axios
      .get(baseUrl)
      .then((response) => this.setState({ list: response.data }))
      .catch((err) => console.log(err));
  };

  handleReset() {
    this.loadVideosData();
  }

  handleFilter = async (value) => {
    return await axios
      .get(`http://localhost:3001/videos?status=${value}`)
      .then((response) => {
        this.setState({ list: response.data });
      })
      .catch((err) => console.log(err));
  };

  // Limpa formulário
  clear() {
    this.setState({ video: initialState.video });
  }

  // Verifica se não há campos em branco
  formVerify(video) {
    if (
      video.title !== "" &&
      video.briefing !== "" &&
      video.price !== "" &&
      video.delivery_date != ""
    ) {
      return true;
    }
    return false;
  }

  // Cadastra video no banco
  save() {
    const video = this.state.video;
    if (this.formVerify(video)) {
      const method = video.id ? "put" : "post";
      const url = video.id ? `${baseUrl}/${video.id}` : baseUrl;
      axios[method](url, video).then((resp) => {
        const list = this.getUpdatedList(resp.data);
        this.setState({ video: initialState.video, list });
      });
    }
  }

  getUpdatedList(video) {
    const list = this.state.list.filter((v) => v.id !== video.id);
    list.unshift(video);
    return list;
  }

  // Coloca os valores do form no objeto video
  updateField(event) {
    const video = { ...this.state.video };
    video[event.target.name] = event.target.value;
    this.setState({ video });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <button type="button" onClick={() => this.handleReset()}>
              Reset
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6">
            <label>
              <b>Filtrar Por:</b>
            </label>
            <button type="button" onClick={() => this.handleFilter("Pendente")}>
              Pendente
            </button>
            <button
              type="button"
              onClick={() => this.handleFilter("Em Andamento")}
            >
              Em Andamento
            </button>
            <button
              type="button"
              onClick={() => this.handleFilter("Concluído")}
            >
              Concluído
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>Título</b>
              </label>
              <input
                type="text"
                className="form-control"
                required
                name="title"
                value={this.state.video.title}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o título:"
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>Briefing</b>
              </label>
              <input
                type="text"
                className="form-control"
                required
                name="briefing"
                value={this.state.video.briefing}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o Briefing:"
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>Preço</b>
              </label>
              <input
                type="text"
                className="form-control"
                required
                name="price"
                value={this.state.video.price}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o preço:"
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>
                <b>Data de Entrega</b>
              </label>
              <input
                type="date"
                className="form-control"
                required
                name="delivery_date"
                value={this.state.video.delivery_date}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite a data de entrega:"
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

  load(video) {
    this.setState({ video });
  }

  remove(video) {
    axios.delete(`${baseUrl}/${video.id}`).then((resp) => {
      const list = this.state.list.filter((v) => v !== video);
      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Briefing</th>
            <th>Preço</th>
            <th>Data de Entrega</th>
            <th>Status</th>
            {/* <th>Cliente</th> */}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((video) => {
      return (
        <tr key={video.id}>
          <td>{video.id}</td>
          <td>{video.title}</td>
          <td>{video.briefing}</td>
          <td>{video.price}</td>
          <td>{video.delivery_date}</td>
          <td>{video.status}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(video)}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(video)}
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
