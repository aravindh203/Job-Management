import * as React from "react";
import { useEffect, useState } from "react";
import {
  Pivot,
  PivotItem,
  CommandBarButton,
  DetailsList,
  IColumn,
  SelectionMode,
  IconButton,
  Dropdown,
  IDropdownOption,
  Icon,
  SearchBox,
} from "@fluentui/react";
import { sp } from "@pnp/sp/presets/all";
import styles from "./../AddForm.module.scss";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import * as moment from "moment";

interface IData {
  key: number;
  name: string;
  ServiceName: string;
  ServiceDate: string;
  StartDate: string;
  EndDate: string;
  Notes: string;
  Status: string;
  Id: number;
  startIndex: number;
  count: number;
}
const DashBoardComponent = (props: any): JSX.Element => {
  const userViewAuthentication = props.admin ? true : false;
  const addIcon = {
    root: {
      ".ms-Button-icon": {
        color: "#fff !important",
      },
      ":hover": {
        ".ms-Button-icon": {
          color: "#fff !important",
        },
      },
    },
  };

  const list = {
    root: {
      ".ms-DetailsHeader": {
        backgroundColor: "#8f3cde",
        padding: "0px",
      },
      ".ms-DetailsHeader-cell": {
        ":hover": {
          backgroundColor: "#8f3cde",
        },
      },
      ".ms-DetailsHeader-cellTitle": {
        color: "#fff",
      },
    },
  };
  const option: IDropdownOption[] = [
    {
      key: "All",
      text: "All",
    },
    {
      key: "InProgress",
      text: "InProgress",
    },
    {
      key: "Canceled",
      text: "Canceled",
    },
    {
      key: "Completed",
      text: "Completed",
    },
  ];

  const col: IColumn[] = [
    {
      key: "1",
      fieldName: "ServiceName",
      name: "ServiceName",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      key: "2",
      fieldName: "ServiceDate",
      name: "ServiceDate",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      key: "3",
      fieldName: "Notes",
      name: "Notes",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      key: "4",
      fieldName: "Status",
      name: "Status",
      minWidth: 120,
      maxWidth: 200,
    },
    {
      key: "5",
      fieldName: "StartDate",
      name: "StartDate",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      key: "6",
      fieldName: "EndDate",
      name: "EndDate",
      minWidth: 150,
      maxWidth: 200,
    },
    {
      key: "7",
      fieldName: "Edit",
      name: "Edit",
      minWidth: 100,
      maxWidth: 150,
      onRender: (item) => {
        let userAuthentication = findUserAccess(item);
        return (
          <IconButton
            iconProps={{ iconName: "edit" }}
            disabled={userAuthentication}
            title="Edit"
            ariaLabel="Edit"
            onClick={() => {
              viewEditHnadle(item, "edit");
            }}
          />
        );
      },
    },
    {
      key: "8",
      fieldName: "View",
      name: "View",
      minWidth: 100,
      maxWidth: 150,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "View" }}
          title="View"
          ariaLabel="View"
          onClick={() => {
            viewEditHnadle(item, "view");
          }}
        />
      ),
    },
    {
      key: "9",
      fieldName: "ChildView",
      name: "ChildView",
      minWidth: 100,
      maxWidth: 150,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "View" }}
          title="View"
          ariaLabel="View"
          onClick={() => {
            viewEditHnadle(item, "ChildView");
          }}
        />
      ),
    },
  ];

  const [MData, setMData] = useState<IData[]>([]);
  const [ChildMData, setChildMData] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [filterData, setFilterData] = useState([]);
  const [pageFilter, setPageFilter] = useState([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayItems: 5,
  });
  console.log("MData", MData);

  const findUserAccess = (item: any) => {
    let isEdit = false;
    if (item.Status === "Canceled") {
      isEdit = true;
    }
    if (userViewAuthentication) {
      return isEdit;
    } else {
      return true;
    }
  };

  const getServiceData = async () => {
    await sp.web.lists
      .getByTitle(props.list.listName)
      .items.select("*")
      .orderBy("Modified", false)
      .get()
      .then((data) => {
        let masterData: IData[] = [];
        if (data.length) {
          data.forEach(async (item) => {
            await sp.web.lists
              .getByTitle("ServiceChild")
              .items.select("*")
              .get()
              .then((result) => {
                let Count = result.filter((val) => val.ServiceId == item.Id);
                masterData.push({
                  key: item.Id,
                  name: item.ServiceName,
                  ServiceName: item.ServiceName ? item.ServiceName : "",
                  ServiceDate: item.ServiceDate
                    ? moment(item.ServiceDate).format("YYYY/MM/DD")
                    : "",
                  StartDate: item.StartDate
                    ? moment(item.StartDate).format("YYYY/MM/DD")
                    : "",
                  EndDate: item.EndDate
                    ? moment(item.EndDate).format("YYYY/MM/DD")
                    : "",
                  Notes: item.Notes ? item.Notes : "",
                  Status: item.Status ? item.Status : "",
                  Id: item.Id ? item.Id : null,
                  startIndex: result.findIndex(
                    (val) => val.ServiceId == item.Id
                  ),
                  count: Count.length,
                });
                setMData([...masterData]);
                setPageFilter([...masterData]);
                setChildMData(result);
              })
              .catch((error) => errorFunction(error, "get child data"));
          });
        } else {
          setMData([]);
          setPageFilter([]);
        }
      })
      .catch((error) => {
        errorFunction(error, "get Services Data");
      });
  };

  const dropFilter = () => {
    var filterData1 = [...MData].filter((value) => {
      if (filter === "InProgress") {
        return value.Status === "InProgress";
      } else if (filter === "Canceled") {
        return value.Status === "Canceled";
      } else if (filter === "Completed") {
        return value.Status === "Completed";
      } else {
        return value;
      }
    });
    let searchdata = [];
    if (filterData1.length) {
      searchdata = [...filterData1].filter((value) => {
        return value.ServiceName.toLowerCase().startsWith(search.trimStart());
      });
    }
    setPageFilter([...searchdata]);
    setFilterData([...searchdata]);
  };

  const handlePageChange = () => {
    props.setChange({
      ...props.change,
      providerDashBoard: false,
      provider: false,
      ProviderEdit: false,
      clientDashBoard: false,
      client: false,
      clientEdit: false,
      contructorDashBoard: false,
      contructor: false,
      conturctorEdit: false,
      servicesDashBoard: false,
      services: true,
      servicesEdit: false,
      isError: false,
      isSpinner: false,
    });
  };

  const viewEditHnadle = (item: IData, clickStatus: string) => {
    props.setFormView({
      authentication: true,
      Id: item.Id,
      status: clickStatus,
    });
    if (clickStatus == "view" || clickStatus == "edit") {
      props.setChange({
        ...props.change,
        providerDashBoard: false,
        provider: false,
        ProviderEdit: false,
        clientDashBoard: false,
        client: false,
        clientEdit: false,
        contructorDashBoard: false,
        contructor: false,
        conturctorEdit: false,
        servicesDashBoard: false,
        services: false,
        servicesEdit: true,
        isError: false,
        isSpinner: false,
      });
    } else if (clickStatus == "ChildView") {
      props.setChange({
        ...props.change,
        providerDashBoard: false,
        provider: false,
        ProviderEdit: false,
        clientDashBoard: false,
        client: false,
        clientEdit: false,
        contructorDashBoard: false,
        contructor: false,
        conturctorEdit: false,
        servicesDashBoard: false,
        serviceChildDashBoard: true,
        services: false,
        servicesEdit: false,
        isError: false,
        isSpinner: false,
      });
    }
  };

  const getPagination = () => {
    if (pageFilter.length) {
      let lastIndex = pagination.currentPage * pagination.displayItems;
      let firstIndex = lastIndex - pagination.displayItems;
      let displayData = [...pageFilter].slice(firstIndex, lastIndex);
      setFilterData(displayData);
    } else {
      setFilterData([]);
    }
  };

  const errorFunction = (error: any, name: string) => {
    console.log(name, error);
    props.setChange({
      providerDashBoard: false,
      provider: false,
      ProviderEdit: false,
      clientDashBoard: false,
      client: false,
      clientEdit: false,
      contructorDashBoard: false,
      contructor: false,
      conturctorEdit: false,
      servicesDashBoard: false,
      serviceChildDashBoard: false,
      services: false,
      servicesEdit: false,
      serviceChildEdit: false,
      isError: true,
      isSpinner: false,
    });
    props.seterror(name);
  };

  useEffect(() => {
    dropFilter();
  }, [filter, search]);

  useEffect(() => {
    getPagination();
  }, [pagination, pageFilter]);
  useEffect(() => {
    getServiceData();
  }, []);

  return (
    <div>
      <div className={styles.btnAlign}>
        <div className={styles.dropContain}>
          <div className={styles.dropDown}>
            <Dropdown
              label="Status"
              options={option}
              selectedKey={filter}
              onChange={(e, item) => setFilter(item.text)}
            />
          </div>
        </div>
        <div className={styles.searchBox}>
          <div>
            <SearchBox
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              disableAnimation
            />
          </div>
          {userViewAuthentication ? (
            <CommandBarButton
              text="New"
              iconProps={{ iconName: "add" }}
              className={styles.newButton}
              styles={addIcon}
              onClick={() => handlePageChange()}
            />
          ) : null}
        </div>
      </div>
      <div>
        <DetailsList
          items={filterData}
          columns={col}
          selectionMode={SelectionMode.none}
          styles={list}
        />
      </div>
      <div>
        <DetailsList
          items={ChildMData}
          groups={filterData}
          columns={col}
          selectionMode={SelectionMode.none}
          styles={list}
        />
      </div>
      <div>
        {filterData.length ? (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(pageFilter.length / pagination.displayItems)}
            onChange={(page) =>
              setPagination({ ...pagination, currentPage: page })
            }
            limiter={3}
          />
        ) : (
          <h3 style={{ margin: "5px 0px", textAlign: "center" }}>
            No Result Data
          </h3>
        )}
      </div>
    </div>
  );
};

export default DashBoardComponent;
