import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "video-camera",
  title: "Videos",
  subtitle: "Cadastro de videos: Incluir, Listar, Alterar e Excluir"
}

const baseUrl = "http://localhost:3001/videos";
const clientsUrl = 'http://localhost:3001/clients';

const initialState = {
  video: { title: "", briefing: "", price: "", delivery_date: "", status: "Pendente", client_id: "" },
  list: []
}

export default class VideoCrud extends Component {

  state = { ...initialState }

  componentWillMount(){
    axios(baseUrl).then(resp => {
      this.setState({ list: resp.data })
    })
    // Consulta ao backend para saber a quantidade de clientes
    axios(clientsUrl).then(resp => {
      console.log(Object.keys(resp.data).length);
    })
  }


  clear() {
    this.setState( { video: initialState.video} )
  }

  formVerify(video) {
    if((video.title != "") && (video.briefing != "") && (video.price != "") && (video.delivery_date != "")){
      return true;
    }
    return false;
  }

  save() {
    const video = this.state.video;
    if(this.formVerify(video)){
      const method = video.id ? 'put' : 'post';
      const url = video.id ? `${baseUrl}/${video.id}` : baseUrl ;
      axios[method](url, video)
        .then(resp => {
          const list = this.getUpdatedList(resp.data);
          this.setState({video: initialState.video, list});
        })
    }
  }

  getUpdatedList(video) {
    const list = this.state.list.filter(v => v.id !== video.id);
    list.unshift(video);
    return list;
  }

  updateField(event) {
    const video = { ...this.state.video }
    video[event.target.name] = event.target.value;
    this.setState({ video });
  }

  // TODO: Associação com cliente
  renderForm() {
    return(
      <div className="form">
        <div className="row">          
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Título</b></label>
              <input type="text" className="form-control"
                required
                name="title"
                value={this.state.video.title}
                onChange={e => this.updateField(e)}
                placeholder="Digite o título:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Briefing</b></label>
              <input type="text" className="form-control"
                required
                name="briefing"
                value={this.state.video.briefing}
                onChange={e => this.updateField(e)}
                placeholder="Digite o Briefing:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Preço</b></label>
              <input type="text" className="form-control"
                required
                name="price"
                value={this.state.video.price}
                onChange={e => this.updateField(e)}
                placeholder="Digite o preço:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Data de Entrega</b></label>
              <input type="text" className="form-control"
                required
                name="delivery_date"
                value={this.state.video.delivery_date}
                onChange={e => this.updateField(e)}
                placeholder="Digite a data de entrega:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="dropdown">
              <button className="btn btn-info dropdown-toggle" type="button"
                id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Cliente
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
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

  load(video) {
    this.setState({ video });
  }

  remove(video) {
    axios.delete(`${baseUrl}/${video.id}`).then(resp => {
      const list = this.state.list.filter(v => v !== video)
      this.setState({ list });
    })
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Briefing</th>
            <th>Preço</th>
            <th>Data de Entrega</th>
            <th>Status</th>
            {/* <th>Cliente</th> */}
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
    return this.state.list.map(video => {
      return (
        <tr key={video.id}>
          <td>{video.id}</td>
          <td>{video.title}</td>
          <td>{video.briefing}</td>
          <td>{video.price}</td>
          <td>{video.delivery_date}</td>
          <td>{video.status}</td>
          {/* <td>{video.client_id}</td> */}
          <td>
            <button className="btn btn-warning"
              onClick={() => this.load(video)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button className="btn btn-danger ml-2"
              onClick={() => this.remove(video)}>
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      )
    })
  }

  // TODO: Conditional Rendering: só renderizar componente de video se houver clientes
  render() {
    return(
      <Main {...headerProps} >
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    )
  }
}
