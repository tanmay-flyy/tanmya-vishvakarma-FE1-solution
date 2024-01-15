import React, { CSSProperties, useEffect, useRef, useState } from "react";
import dp from "./assets/dp.jpg"

const wrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  height: "auto",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: "10px",
  justifyContent: "flex-start",
  alignItems: "center",
  position: "relative",
  borderBottom: "2px solid #3498db",
  cursor: "pointer",
  borderRadius: "8px",
  background: "#ecf0f1",
};

const selectedItemsContainerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
};

const selectIconStyle: CSSProperties = {
  display: "inline-block",
  width: "20px",
  marginLeft: "10px",
  fontSize: "18px",
  color: "#3498db",
};

const dropDownStyle = (opened: boolean): CSSProperties => ({
  position: "absolute",
  top: "100%",
  left: "0px",
  opacity: opened ? 1 : 0,
  visibility: opened ? "visible" : "hidden",
  width: "100%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
  padding: "8px",
  background: "white",
  zIndex: 1,
});

const chipStyle = (focused: boolean, image?: string): CSSProperties => ({
  background: focused ? "#3498db" : "#2980b9",
  padding: "6px 6px",
  borderRadius: "50px",
  margin: "4px",
  display: "inline-flex",
  alignItems: "center",
  color: "white",
  cursor: "pointer",
  position: "relative",
  height: "20px",
  maxWidth: "200px",
});

const searchInputStyle: any = {
  flexGrow: 1,
  padding: "8px",
  border: "none",
  outline: "none",
  borderRadius: "8px",
  margin: "0 10px",
  background: "#ecf0f1",
};

const listItemStyle: any = {
  color: "#71797E",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  padding: "5px",
};

const listItemHoverStyle: CSSProperties = {
  background: "#ddd",
};

type Item = {
  id: string;
  value: string;
  image?: any;
  subText?: string;
};

const App = () => {

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [opened, setIsOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [focusListIndex, setFocusListIndex] = useState<string | null>(null);

  const items: Item[] = [
    { id: "1", value: "Zepto", image: dp, subText: "a@b.com" },
    { id: "2", value: "Linear", image: dp, subText: "linear@search.com" },
    { id: "3", value: "Elon Musk", image: dp, subText: "elon@musk.com" },
    { id: "4", value: "Apple" },
    { id: "5", value: "BMW" },
    { id: "6", value: "Pot" },
    { id: "7", value: "Node" },
  ];

  const onClickWrapper = () => {
    setIsOpened(!opened);
  };

  const onClickDeleteItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item?.id !== id));
  };

  const onFocusChip = (index: number) => {
    setFocusIndex(index);
  };

  const onBlurChip = () => {
    setFocusIndex(null);
  };

  const onDropDownClicked = (newItem: Item) => {
    setSelectedItems([...selectedItems, newItem]);
    setFocusIndex(null);
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.code === "Backspace" &&
      searchQuery === "" &&
      selectedItems.length > 0
    ) {
      e.preventDefault();
      if (focusIndex === null) {
        setFocusIndex(selectedItems.length - 1);
      } else {
        const focusedItem = selectedItems[focusIndex];
        onClickDeleteItem(focusedItem?.id);
        setFocusIndex(null);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false);
        setFocusIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (selectedItems.length === items.length) {
      setIsOpened(false);
    }
  }, [selectedItems, items.length]);

  useEffect(() => {
    if (searchQuery === "") {
      setIsOpened(false);
    } else {
      setIsOpened(true);
    }
  }, [searchQuery]);

  const filteredItems = items.filter(
    (item) =>
      selectedItems.findIndex((sel) => sel?.id === item?.id) === -1 &&
      item.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={wrapperStyle} onClick={onClickWrapper} ref={wrapperRef}>
      <div style={selectedItemsContainerStyle}>
        {selectedItems.map(({ id, value, image }, index) => (
          <div
            key={id}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              key={id}
              onClick={(e) => {
                e.stopPropagation();
                onFocusChip(index);
              }}
              onBlur={onBlurChip}
              tabIndex={index === focusIndex ? 0 : -1}
              onFocus={() => onFocusChip(index)}
              style={chipStyle(index === focusIndex, image)}
            >
              {image && (
                <img
                  src={image}
                  alt={value}
                  style={{
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    marginLeft: "-2px",
                  }}
                />
              )}
              <span style={{ margin: "6px" }}>{value}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onClickDeleteItem(id);
                }}
              >
                <div style={{ marginRight: "6px" }}>&#10005;</div>
              </span>
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={onKeyDownInput}
        style={searchInputStyle}
      />
      <span style={selectIconStyle}>
        {opened ? <div>&uarr;</div> : <div>&darr;</div>}
      </span>
      {filteredItems.length > 0 && (
        <ul style={dropDownStyle(opened)}>
          {filteredItems.map(({ id, value, image, subText }) => {
            const lowerCaseValue = value.toLowerCase();
            const lowerCaseSearchQuery = searchQuery.toLowerCase();
            const startIndex = lowerCaseValue.indexOf(lowerCaseSearchQuery);
            const endIndex = startIndex + searchQuery.length;

            return (
              <li
                onMouseEnter={() => setFocusListIndex(id)}
                onMouseLeave={() => setFocusListIndex(null)}
                style={{
                  ...listItemStyle,
                  ...(focusListIndex === id ? listItemHoverStyle : {}),
                }}
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  onDropDownClicked({ id, value, image });
                  setSearchQuery("");
                }}
              >
                {image && (
                  <img
                    src={image}
                    alt={value}
                    style={{
                      maxWidth: "20px",
                      borderRadius: "50%",
                      border: "1px solid black",
                      marginRight: "6px",
                    }}
                  />
                )}
                <div>
                  {startIndex !== -1 ? (
                    <>
                      {value.substring(0, startIndex)}
                      <strong style={{ fontWeight: "bold", color: "black" }}>
                        {value.substring(startIndex, endIndex)}
                      </strong>
                      {value.substring(endIndex)}
                    </>
                  ) : (
                    value
                  )}
                </div>
                {subText && (
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#C0C0C0	",
                      marginLeft: "10px",
                    }}
                  >
                    {subText}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default App;