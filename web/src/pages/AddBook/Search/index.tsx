import React, { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import PageNavigation from "./PageNavigation";
import GoogleBook from "./Interfaces/GoogleBook";
import Loader from "../../../assets/loader.gif"

//https://medium.com/@imranhsayed/live-search-with-react-instant-search-pagination-6acd476af756

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  publisher: string;
  publishedDate: string;
  pageCount: number;
}

type MyProps = { handleBookSelect: any };
type MyState = {
  query: string;
  results: Book[];
  error: string;
  message: string;
  loading: boolean;
  totalResults: number;
  totalPages: number;
  currentPageNo: number;
  hover: boolean;
  hover_id: string;
};

class Search extends React.Component<MyProps, MyState> {
  private cancel: any;

  constructor(props: any) {
    super(props);

    this.state = {
      query: "",
      results: [],
      error: "",
      message: "",
      loading: false,
      totalResults: 0,
      totalPages: 0,
      currentPageNo: 0,
      hover: false,
      hover_id: ""
    };

    this.cancel = "";
  }

  // Search.js
  /**
   * Get the Total Pages count.
   *
   * @param total
   * @param denominator Count of results per page
   * @return {number}
   */
  getPagesCount = (total: number, denominator: number) => {
    const divisible = total % denominator === 0;
    const valueToBeAdded = divisible ? 0 : 1;
    return Math.floor(total / denominator) + valueToBeAdded;
  };

  ConvertGoogleBookToBook = (book: GoogleBook) => {
    // Not all books have image data, get highest res image possible
    // A more thorough demo would have small, medium, large, etc
    let image = "https://via.placeholder.com/150";
    if (book.volumeInfo.imageLinks) {
      image = book.volumeInfo.imageLinks.extraLarge;
      if (typeof image === "undefined") {
        image = book.volumeInfo.imageLinks.large;
      }
      if (typeof image === "undefined") {
        image = book.volumeInfo.imageLinks.medium;
      }
      if (typeof image === "undefined") {
        image = book.volumeInfo.imageLinks.small;
      }
      if (typeof image === "undefined") {
        image = book.volumeInfo.imageLinks.smallThumbnail;
      }
      if (typeof image === "undefined") {
        image = book.volumeInfo.imageLinks.thumbnail;
      }
    }

    return {
      id: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(',') : "",
      image: image,
      description: book.volumeInfo.description,
      publisher: book.volumeInfo.publisher,
      publishedDate: book.volumeInfo.publishedDate,
      pageCount: book.volumeInfo.pageCount
    };
  };

  ConvertGoogleBooksToBooks = (books: GoogleBook[]) => {
    const convertedBooks: Book[] = [];

    for (const b of books) {
      convertedBooks.push(this.ConvertGoogleBookToBook(b));
    }

    return convertedBooks;
  };

  /**
   * Fetch the search results and update the state with the result.
   *
   * @param {int} updatedPageNo Updated Page No.
   * @param {String} query Search Query.
   *
   */
  fetchSearchResults = (updatedPageNo: number, query: string) => {
    const pageIndex = updatedPageNo
      ? `&startIndex=${updatedPageNo * 6 - 6}`
      : "";
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURI(
      query
    )}${pageIndex}&maxResults=6`;

    if (this.cancel) {
      // Cancel the previous request before making a new request
      this.cancel.cancel();
    }

    // Create a new CancelToken
    this.cancel = axios.CancelToken.source();

    axios
      .get(searchUrl, {
        cancelToken: this.cancel.token
      })
      .then((res) => {
        console.log(res.data);

        const total = res.data.totalItems;
        const totalPagesCount = this.getPagesCount(total, 6);
        const resultNotFoundMsg = !res.data.items.length
          ? "Nenhum livro encontrado. Por favor tente uma nova consulta."
          : "";
        this.setState({
          results: this.ConvertGoogleBooksToBooks(res.data.items),
          totalResults: res.data.totalItems,
          currentPageNo: updatedPageNo,
          totalPages: totalPagesCount,
          message: resultNotFoundMsg,
          loading: false
        });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          this.setState({
            loading: false,
            message:
              ""
          });
        }
      });
  };

  handleOnInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    if (!query) {
      this.setState({
        query,
        results: [],
        message: "",
        totalPages: 0,
        totalResults: 0
      });
    } else {
      this.setState({ query, loading: true, message: "" }, () => {
        this.fetchSearchResults(1, query);
      });
    }
  };

  /**
   * Fetch results according to the prev or next page requests.
   *
   * @param {String} type 'prev' or 'next'
   */
  handlePageClick = (type: any, event: FormEvent) => {
    event.preventDefault();

    const updatedPageNo =
      "prev" === type
        ? this.state.currentPageNo - 1
        : this.state.currentPageNo + 1;

    if (!this.state.loading) {
      this.setState({ loading: true, message: "" }, () => {
        // Fetch previous 6 Results
        this.fetchSearchResults(updatedPageNo, this.state.query);
      });
    }
  };

  renderSearchResults = () => {
    const { results } = this.state;

    if (Object.keys(results).length && results.length) {
      return (
        <div
          id="results-container"
          className="results-container"
          style={css_resultscontainer}
        >
          {results.map((result) => {
            return (
              <a
                id="result-item"
                key={result.id}
                href={result.image}
                className="result-item"
                style={css_resultitem}
                onMouseOver={() => this.handleHover(true, result.id)}
                onMouseLeave={() => this.handleHover(false, '')}
                onClick={this.props.handleBookSelect.bind(this, result)}
              >
                <div
                  id="book-image"
                  className="book-image"
                  style={this.state.hover && this.state.hover_id === result.id ? css_bookImageHover : css_bookImage}
                >
                  <img
                    id="image"
                    className="image"
                    style={css_image}
                    src={result.image}
                    alt={result.title}
                  />
                </div>
                <h6
                  id="book-title"
                  className="book-title"
                  style={this.state.hover && this.state.hover_id === result.id ? css_bookTitleHover : css_bookTitle}
                >
                  {result.title}
                </h6>
                <h6
                  id="book-author"
                  className="book-author"
                  style={this.state.hover && this.state.hover_id === result.id ? css_bookAuthorHover : css_bookAuthor}
                >
                  {result.author}
                </h6>
                
              </a>
            );
          })}
        </div>
      );
    }
  };

  handleHover= (hoverTrue: boolean, hoverID: string) => {
    this.setState({hover: hoverTrue, hover_id: hoverID});
  }

  render() {
    const { query, loading, message, currentPageNo, totalPages, hover, hover_id } = this.state;

    const showPrevLink = 1 < currentPageNo;
    const showNextLink = totalPages > currentPageNo;

    return (
      <div id="container" style={css_container}>
        {/*	Heading*/}
        <h2 className="heading" style={css_heading}>
          Carregar livro do Google
        </h2>
        {/* Search Input*/}
        <label
          className="search-label"
          htmlFor="search-input"
          style={css_searchlabel}
        >
          <input
            type="text"
            style={css_searchinput}
            name="query"
            value={query}
            id="search-input"
            placeholder="Título/Autor/Editora..."
            onChange={this.handleOnInputChange}
          />
        </label>

        {/*	Error Message*/}
        {message && (
          <p id="message" className="message">
            {message}
          </p>
        )}

        {/*	Loader*/}
        {loading ? (
          <img
            id="search-loading-show"
            src={Loader}
            className="search-loading-show"
            alt="loader"
            style={css_searchLoadingShow}
          />
        ) : (
          <img
            id="search-loading-hide"
            src={Loader}
            className="search-loading-hide"
            alt="loader"
            style={css_searchLoadingHide}
          />
        )}

        {/*Navigation*/}
        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={this.handlePageClick.bind(this, "prev")}
          handleNextClick={this.handlePageClick.bind(this, "next")}
        />

        {/*	Result*/}
        {this.renderSearchResults()}

        {/*Navigation*/}
        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={this.handlePageClick.bind(this, "prev")}
          handleNextClick={this.handlePageClick.bind(this, "next")}
        />
      </div>
    );
  }
}

const css_container: React.CSSProperties = {
  margin: "80px auto",
  width: "100%",
  maxWidth: "730px",
  borderRadius: "8px"
};

const css_heading: React.CSSProperties = {
  fontSize: "30px",
  color: "#001a00",
};

const css_searchlabel: React.CSSProperties = {
  position: "relative"
};

const css_searchinput: React.CSSProperties = {
  width: "100%",
  padding: "16px",
  fontSize: "36px",
  fontStyle: "italic",
  color: "#444",
  borderRadius: "8px",
  outline: "none",
  border: "none", 
};

const css_resultscontainer: React.CSSProperties = {
  display: "flex",
  flexFlow: "wrap"
};

const css_resultitem: React.CSSProperties = {
  position: "relative",
  padding: "1px",
  border: "1px solid #898989",
  margin: "16px",
  textAlign: "center",
  minWidth: "200px",
  maxWidth: "200px",
  maxHeight: "200px",
  boxShadow: "2px 2px 2px #898989",
  
  display: "flex",
  justifyContent: "center",
  justifyItems: "center"
};

const css_bookTitle: React.CSSProperties = {
  position: "absolute",
  opacity: 0
};

const css_bookTitleHover: React.CSSProperties = {
  display: "flex",
  color: "#000",
  fontSize: "14px",
  position: "absolute",
  backgroundColor: "#669f77",
  marginTop: "1px"
};

const css_bookAuthor: React.CSSProperties = {
  position: "absolute",
  opacity: 0
};

const css_bookAuthorHover: React.CSSProperties = {
  color: "#000",
  fontSize: "14px",
  position: "absolute",
  bottom: "1px",
  backgroundColor: "#669f77",
};

const css_bookImage: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignSelf: "center",
  boxSizing: "border-box",
};

const css_bookImageHover: React.CSSProperties = {
  width: "100%",
  display: "flex",
  opacity: 0.8,
  position: "relative",
  justifyContent: "center",
  alignSelf: "center",
  boxSizing: "border-box",
};

const css_image: React.CSSProperties = {
  width: "100%",
  height: "198px"
};

const css_searchLoadingShow: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  margin: "auto",
  display: "inline-block"
};

const css_searchLoadingHide: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  margin: "auto",
  display: "none"
};

export default Search;