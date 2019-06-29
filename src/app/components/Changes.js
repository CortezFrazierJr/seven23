/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

import UserButton from "./settings/UserButton";
import Fab from "@material-ui/core/Fab";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import ContentAdd from "@material-ui/icons/Add";

import LineGraph from "./charts/LineGraph";
import ChangeForm from "./changes/ChangeForm";
import ChangeList from "./changes/ChangeList";

import ChangeActions from "../actions/ChangeActions";

const styles = theme => ({});

export function Changes(props) {
  const dispatch = useDispatch();

  // Is component panel open ?
  const [isOpen, setIsOpen] = useState(false);
  // Component to display on popup menu
  const [component, setComponent] = useState(null);

  // All used currencies
  const [currencies, setCurrencies] = useState(null);

  // Selected currency based on props.params.id
  const [currencyTitle, setCurrencyTitle] = useState(null);
  //
  const [graph, setGraph] = useState(null);

  const [usedCurrencies, setUsedCurrencies] = useState(null);
  //
  const changes = useSelector(state => state.changes);
  //
  //
  const [list, setList] = useState(null);

  const selectedCurrency = useSelector(state =>
    state.currencies.find(c => c.id == props.match.params.id)
  );

  // When changes is udpated
  useEffect(() => {
    setCurrencyTitle(selectedCurrency ? selectedCurrency.name : "");
    dispatch(
      ChangeActions.process(selectedCurrency ? selectedCurrency.id : null)
    )
      .then(result => {
        setGraph(result.graph);
        setUsedCurrencies(result.usedCurrency);
        setList(result.list);
      })
      .catch(() => {});
  }, [changes, props.match.params.id]);

  const handleOpenChange = (change = null) => {
    const component = (
      <ChangeForm
        change={change}
        onSubmit={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
    );
    setComponent(component);
    setIsOpen(true);
  };

  const handleDuplicateChange = change => {
    const newChange = Object.assign({}, change);
    delete newChange.id;
    delete newChange.date;
    handleOpenChange(newChange);
  };

  return (
    <div className="layout">
      <div className={"modalContent " + (isOpen ? "open" : "")}>
        <Card square className="modalContentCard">
          {component}
        </Card>
      </div>

      <header className="layout_header showMobile">
        <div className="layout_header_top_bar">
          <div
            className={
              (!selectedCurrency ? "show " : "") + "layout_header_top_bar_title"
            }
          >
            <h2>Changes</h2>
          </div>
          <div
            className={
              (selectedCurrency ? "show " : "") + "layout_header_top_bar_title"
            }
            style={{ right: 80 }}
          >
            <IconButton onClick={() => props.history.push("/changes")}>
              <KeyboardArrowLeft style={{ color: "white" }} />
            </IconButton>
            <h2 style={{ paddingLeft: 4 }}>{currencyTitle}</h2>
          </div>
          <div className="showMobile">
            <UserButton type="button" color="white" />
          </div>
        </div>
      </header>

      <div className="layout_two_columns">
        <div
          className={
            (selectedCurrency ? "hide " : "") +
            "layout_content wrapperMobile large"
          }
        >
          {usedCurrencies && !usedCurrencies.length ? (
            <div className="emptyContainer">
              <p>No changes</p>
            </div>
          ) : (
            ""
          )}

          {!usedCurrencies
            ? [
                "w120",
                "w150",
                "w120",
                "w120",
                "w120",
                "w150",
                "w120",
                "w120"
              ].map((value, i) => {
                return (
                  <ListItem button key={i} disabled={true}>
                    <ListItemText
                      primary={<span className={`loading ${value}`} />}
                      secondary={<span className="loading w50" />}
                    />
                    <KeyboardArrowRight />
                  </ListItem>
                );
              })
            : ""}

          {usedCurrencies && usedCurrencies.length ? (
            <List>
              {usedCurrencies && graph
                ? usedCurrencies.map(currency => {
                    return (
                      <ListItem
                        button
                        key={currency.id}
                        selected={props.match.params.id == currency.id}
                        disabled={!list}
                        style={{ position: "relative" }}
                        onClick={event => {
                          if (list != null) {
                            setList();
                            props.history.push("/changes/" + currency.id);
                          }
                        }}
                      >
                        <ListItemText
                          primary={currency.name}
                          secondary={currency.code}
                        />
                        <div
                          style={{
                            position: "absolute",
                            width: 100,
                            right: 60,
                            top: 0,
                            bottom: 0,
                            opacity: 0.5
                          }}
                        >
                          <LineGraph
                            values={[{ values: graph[currency.id] }]}
                          />
                        </div>
                        <KeyboardArrowRight />
                      </ListItem>
                    );
                  })
                : ""}
            </List>
          ) : (
            ""
          )}
        </div>

        {selectedCurrency ? (
          <div className="layout_content wrapperMobile">
            <h1 className="hideMobile" style={{ padding: "18px 30px 0" }}>
              {selectedCurrency.name}
            </h1>
            <ChangeList
              changes={list || []}
              currency={selectedCurrency}
              currencies={usedCurrencies}
              isLoading={!list}
              onEditChange={handleOpenChange}
              onDuplicateChange={handleDuplicateChange}
              onDeleteChange={change => {
                dispatch(ChangeActions.delete(change));
              }}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      <Fab
        color="primary"
        aria-label="Add"
        className="layout_fab_button show"
        disabled={!usedCurrencies}
        onClick={() => handleOpenChange()}
      >
        <ContentAdd />
      </Fab>
    </div>
  );
}

// class Changes extends Component {
//   constructor(props) {
//     super();
//     this.props = props;
//     this.history = props.history;
//     this.state = {
//       changes: null,
//       chain: null,
//       currencies: null, // List of used currency
//       change: null,
//       graph: {},
//       currency_title: "",
//       isLoading: true,
//       component: null,
//       open: false
//     };
//   }

//   handleOpenChange = (change = null) => {
//     const component = (
//       <ChangeForm
//         change={change || this.state.change}
//         onSubmit={this.handleCloseChange}
//         onClose={this.handleCloseChange}
//       />
//     );
//     this.setState({
//       open: true,
//       change: change,
//       component: component
//     });
//   };

//   handleCloseChange = () => {
//     this.setState({
//       change: null,
//       open: false,
//       component: null
//     });
//   };

//   handleDuplicateChange = change => {
//     let duplicatedItem = {};
//     for (var key in change) {
//       duplicatedItem[key] = change[key];
//     }
//     delete duplicatedItem.id;
//     delete duplicatedItem.date;

//     const component = (
//       <ChangeForm
//         change={duplicatedItem}
//         onSubmit={this.handleCloseChange}
//         onClose={this.handleCloseChange}
//       />
//     );

//     this.setState({
//       change: duplicatedItem,
//       open: true,
//       component: component
//     });
//   };

//   handleDeleteChange = change => {
//     this.props.dispatch(ChangeActions.delete(change));
//   };

//   sortChanges = (a, b) => {
//     if (a.date > b.date) {
//       return -1;
//     } else if (a.date < b.date) {
//       return 1;
//     } else if (a.name > b.name) {
//       return -1;
//     }
//     return 1;
//   };

//   // Timeout of 350 is used to let perform CSS transition on toolbar
//   _updateChange = changes => {
//     const { selectedCurrency, currencies } = this.props;
//     let list = [];
//     const currency = currencies.find(
//       c => c.id === parseInt(this.props.match.params.id)
//     );
//     let previousRate = null;

//     changes.chain
//       .sort(this.sortChanges)
//       .reverse()
//       .forEach(change => {
//         const tmp = Object.assign({}, change);
//         tmp.date = new Date(change.date);
//         tmp.local_currency = currencies.find(
//           c => c.id === change.local_currency
//         );
//         tmp.new_currency = currencies.find(c => c.id === change.new_currency);

//         if (currency) {
//           if (
//             change.rates[selectedCurrency.id] &&
//             change.rates[selectedCurrency.id][currency.id]
//           ) {
//             tmp.rate = change.rates[selectedCurrency.id][currency.id];
//             tmp.accurate = true;
//           } else if (
//             change.secondDegree[selectedCurrency.id] &&
//             change.secondDegree[selectedCurrency.id][currency.id]
//           ) {
//             tmp.rate = change.secondDegree[selectedCurrency.id][currency.id];
//             tmp.accurate = false;
//           }

//           if (!previousRate) {
//             previousRate = tmp.rate;
//           } else {
//             if (tmp.rate < previousRate) {
//               tmp.trend = "up";
//             } else if (tmp.rate > previousRate) {
//               tmp.trend = "down";
//             } else if (tmp.rate === previousRate) {
//               tmp.trend = "flat";
//             }
//             previousRate = tmp.rate;
//           }
//         }

//         list.push(tmp);
//       });

//     list.sort(this.sortChanges);

//     if (list) {
//       let usedCurrency = [];
//       if (list && list.length) {
//         const arrayOfUsedCurrency = Object.keys(
//           changes.chain[changes.chain.length - 1].rates
//         );
//         usedCurrency = currencies.filter(item => {
//           return (
//             arrayOfUsedCurrency.indexOf(`${item.id}`) != -1 &&
//             item.id != selectedCurrency.id
//           );
//         });
//       }

//       let graph = {};

//       list.forEach(block => {
//         Object.keys(block.rates).forEach(key => {
//           if (key != selectedCurrency.id) {
//             let r = block.rates[key][selectedCurrency.id];
//             if (!r && block.secondDegree) {
//               r = block.secondDegree[key]
//                 ? block.secondDegree[key][selectedCurrency.id]
//                 : null;
//             }

//             if (r) {
//               if (!graph[key]) {
//                 graph[key] = [];
//               }
//               graph[key].push({ date: block.date, value: 1 / r });
//             }
//           }
//         });
//       });
//       if (currency) {
//         list = list.filter((item, index) => {
//           return (
//             item.local_currency.id === currency.id ||
//             item.new_currency.id === currency.id
//           );
//         });
//       }

//       this.setState({
//         changes: list,
//         chain: list,
//         graph: graph,
//         currencies: usedCurrency,
//         isLoading: false,
//         currency: currency,
//         currency_title: currency ? currency.name : this.state.currency_title
//       });
//     }
//   };

//   componentWillMount() {
//     this._updateChange(this.props.changes, true);
//   }

//   componentWillReceiveProps(nextProps) {
//     if (
//       this.props.selectedCurrency.id != nextProps.selectedCurrency.id ||
//       (nextProps.match.params.id &&
//         this.props.match.params.id != nextProps.match.params.id) ||
//       this.props.isSyncing != nextProps.isSyncing
//     ) {
//       this.setState({
//         isLoading: true,
//         changes: null,
//         chain: null
//       });
//     }
//     setTimeout(() => this._updateChange(nextProps.changes, false), 100);
//   }

//   render() {
//     const {
//       currencies,
//       open,
//       changes,
//       isLoading,
//       currency_title,
//       graph
//     } = this.state;
//     const { isSyncing } = this.props;

//     return (
//
//     );
//   }
// }

// Changes.propTypes = {
//   classes: PropTypes.object.isRequired,
//   changes: PropTypes.object.isRequired,
//   currencies: PropTypes.array.isRequired,
//   account: PropTypes.object.isRequired,
//   selectedCurrency: PropTypes.object.isRequired,
//   isSyncing: PropTypes.bool.isRequired
// };

// const mapStateToProps = (state, ownProps) => {
//   return {
//     changes: state.changes,
//     currencies: state.currencies,
//     account: state.account,
//     isSyncing: state.state.isSyncing || state.state.isLoading,
//     selectedCurrency:
//       state.currencies && Array.isArray(state.currencies)
//         ? state.currencies.find(c => c.id === state.account.currency)
//         : null
//   };
// };

// export default connect(mapStateToProps)(withStyles(styles)(Changes));
