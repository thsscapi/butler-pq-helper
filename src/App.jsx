import React, { useState } from "react";
import { RIDDLES } from "./riddleConfig";
import { BOOKSHELVES } from "./bookshelfConfig";
import "./App.css";

// Normalize text: lowercase, remove apostrophes/hyphens, strip other punctuation
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[\'-]/g, "") // "shan't" -> "shant", "up-side" -> "upside"
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Return array of bookshelfIds that match the query (partial words allowed)
function getMatchingBookshelves(query) {
  const normQuery = normalize(query);
  if (!normQuery) return [];

  const queryTokens = normQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) return [];

  return RIDDLES.filter((r) => {
    const normText = normalize(r.text);
    const textTokens = normText.split(/\s+/).filter(Boolean);

    // every query token must match the start of at least one word in the riddle
    return queryTokens.every((qToken) =>
      textTokens.some((tToken) => tToken.startsWith(qToken))
    );
  }).map((r) => r.bookshelfId);
}

const MAP_WIDTH = 6622;
const MAP_HEIGHT = 2228;

function ShelfPreview({ shelf }) {
  const outerStyle = {
    width: "100%",
    paddingTop: "80%", // aspect ratio of preview card; same trick as before
    borderRadius: 6,
    position: "relative",
    backgroundColor: "#020617",
    boxSizing: "border-box",
    overflow: "hidden",
    border: "1px solid #374151",
  };

  if (!shelf) {
    // Empty placeholder when there is no match / no input
    return (
      <div
        style={{
          ...outerStyle,
          borderStyle: "dashed",
          opacity: 0.6,
        }}
      />
    );
  }

  // Convert % rectangle to pixel coordinates on the original map
  const viewBoxX = (shelf.xPercent / 100) * MAP_WIDTH;
  const viewBoxY = (shelf.yPercent / 100) * MAP_HEIGHT;
  const viewBoxW = (shelf.widthPercent / 100) * MAP_WIDTH;
  const viewBoxH = (shelf.heightPercent / 100) * MAP_HEIGHT;

  return (
    <div style={outerStyle}>
      <svg
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
        }}
      >
        <image
          href="/butler-map.png"
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
        />
      </svg>
    </div>
  );
}

// Helper: order-based styles for the result cards
function getOrderCardStyles(order) {
  if (order === 1) {
    return {
      borderColor: "rgba(250, 204, 21, 0.9)",
      boxShadow: "0 0 8px rgba(250, 204, 21, 0.5)",
      background: "rgba(250, 204, 21, 0.06)",
    };
  }
  if (order === 2) {
    return {
      borderColor: "rgba(74, 222, 128, 0.9)",
      boxShadow: "0 0 8px rgba(74, 222, 128, 0.5)",
      background: "rgba(74, 222, 128, 0.06)",
    };
  }
  if (order === 3) {
    return {
      borderColor: "rgba(96, 165, 250, 0.9)",
      boxShadow: "0 0 8px rgba(96, 165, 250, 0.5)",
      background: "rgba(96, 165, 250, 0.06)",
    };
  }
  if (order === 4) {
    return {
      borderColor: "rgba(244, 114, 182, 0.9)",
      boxShadow: "0 0 8px rgba(244, 114, 182, 0.5)",
      background: "rgba(244, 114, 182, 0.06)",
    };
  }
  return {};
}

export default function App() {
  const [inputs, setInputs] = useState(["", "", "", ""]);

  const handleChange = (index, value) => {
    setInputs((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleReset = () => {
    setInputs(["", "", "", ""]);
  };

  const matchesByField = inputs.map((value) => getMatchingBookshelves(value));

  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#050509",
          color: "#eee",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 1.5rem 0.5rem",
          }}
        >
          {/* Header */}
          <h1
            style={{
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            Sparrow&apos;s BPQ Helper
          </h1>

          <p
            style={{
              margin: "0 0 0.5rem 0",
              opacity: 0.85,
              textAlign: "center",
            }}
          >
            A small helper tool for the bookshelf riddle stage in Butler PQ
            (MapleLegends). Type fragments of each riddle and see which
            bookshelf they correspond to on the map. Inspired by{" "}
            <a
              href="https://forum.maplelegends.com/index.php?threads/halloween-2023-butler-pq-guide.51846/"
              target="_blank"
              rel="noreferrer"
            >
              Hanamiru&apos;s BPQ Guide
            </a>
            .
          </p>

          <p
            style={{
              margin: "0 0 1rem 0",
              fontSize: "0.85rem",
              opacity: 0.7,
              textAlign: "center",
            }}
          >
            Created by: <strong>thsscapi (Sparrow)</strong>
          </p>

          {/* ROW 1: instructions (left) + fields (right) */}
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              flexWrap: "wrap",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            {/* Instructions column */}
            <div
              style={{
                flex: "1 1 300px",
                minWidth: 260,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  background: "#111822",
                  borderRadius: 8,
                  border: "1px solid #333",
                  padding: "0.6rem 0.8rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                }}
              >
                <h2
                  style={{
                    fontSize: "0.95rem",
                    margin: "0 0 0.35rem 0",
                  }}
                >
                  How to use
                </h2>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: "1.2rem",
                    color: "#9ca3af",
                  }}
                >
                  <li>Fill in the fields to highlight all matching shelves.</li>
                  <li>
                    If multiple shelves are highlighted, enter more words (be
                    more specific).
                  </li>
                  <li>
                    Approach and click/talk to each shelf in <b>ANY</b> order.
                    It is recommended to walk anti-clockwise to finish at the
                    top.
                  </li>
                </ol>
              </div>
            </div>

            {/* Fields column */}
            <div
              style={{
                flex: "1 1 280px",
                minWidth: 280,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  background: "#111822",
                  borderRadius: 8,
                  border: "1px solid #333",
                  padding: "0.6rem 0.8rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                }}
              >
                {inputs.map((value, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: index === inputs.length - 1 ? 0 : "0rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.25rem",
                      }}
                    >
                      #{index + 1}
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder="e.g. cold stare lady"
                        style={{
                          padding: "0.3rem 0.45rem",
                          marginLeft: "0.5rem",
                          width: "75%",
                          borderRadius: 6,
                          border: "1px solid #374151",
                          background: "#020617",
                          color: "#e5e7eb",
                          fontSize: "0.85rem",
                          outline: "none",
                          transition:
                            "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                        }}
                      />
                    </label>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        marginTop: "0.15rem",
                        minHeight: "0.5em",
                      }}
                    >
                      {value && matchesByField[index].length > 1 && (
                        <span>{matchesByField[index].length} matches found</span>
                      )}
                      {value && matchesByField[index].length === 1 && (
                        <span>Unique match found ✅</span>
                      )}
                      {value && matchesByField[index].length === 0 && (
                        <span>No matches yet</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Reset button */}
              <div
                style={{
                  marginTop: "0.6rem",
                  textAlign: "left",
                }}
              >
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: "0.3rem 0.75rem",
                    borderRadius: 6,
                    border: "1px solid #444",
                    background: "#111822",
                    color: "#eee",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Reset all fields
                </button>
              </div>
            </div>
          </div>

          {/* ROW 1.5: matched shelf preview cards */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                background: "#111822",
                borderRadius: 8,
                border: "1px solid #333",
                padding: "0.6rem 0.8rem 0.8rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              }}
            >
              <h2
                style={{
                  fontSize: "0.95rem",
                  margin: "0 0 0.25rem 0",
                }}
              >
                Matched shelves (zoomed)
              </h2>
              <p
                style={{
                  fontSize: "0.8rem",
                  margin: "0 0 0.5rem 0",
                  color: "#9ca3af",
                }}
              >
                Each card below shows the best matching bookshelf for that
                riddle, using the same colour as the highlight on the map.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                {[0, 1, 2, 3].map((idx) => {
                  const order = idx + 1;
                  const inputValue = inputs[idx].trim();
                  const shelfIds = matchesByField[idx];
                  const matchingShelves = BOOKSHELVES.filter((shelf) =>
                    shelfIds.includes(shelf.id)
                  );
                  const primaryShelf =
                    matchingShelves.length > 0 ? matchingShelves[0] : null;
                  const cardStyles = getOrderCardStyles(order);

                  let statusText = "";
                  if (!inputValue) {
                    statusText = "No input yet.";
                  } else if (shelfIds.length === 0) {
                    statusText = "No shelves match this text.";
                  } else if (shelfIds.length === 1) {
                    statusText = `Unique shelf: ${primaryShelf?.label || ""}`;
                  } else {
                    statusText = `${shelfIds.length} possible shelves. Showing one example: ${primaryShelf?.label || ""
                      }`;
                  }

                  return (
                    <div
                      key={order}
                      style={{
                        flex: "1 1 150px",
                        minWidth: 150,
                        maxWidth: 220,
                        borderRadius: 8,
                        border: "1px solid #444",
                        padding: "0.45rem 0.5rem 0.5rem",
                        boxSizing: "border-box",
                        ...cardStyles,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.8rem",
                          marginBottom: "0.25rem",
                          fontWeight: 500,
                        }}
                      >
                        #{order}
                      </div>
                      <ShelfPreview shelf={primaryShelf} />
                      <div
                        style={{
                          fontSize: "0.75rem",
                          marginTop: "0.25rem",
                          color: "#9ca3af",
                          minHeight: "2.4em",
                        }}
                      >
                        {statusText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ROW 2: full-width map */}
          <div className="map-wrapper-card">
            <div className="map-container">
              <img
                src="/butler-map.png"
                alt="Butler PQ Map"
                className="map-image"
              />

              {BOOKSHELVES.map((shelf) => {
                const activeOrders = matchesByField
                  .map((matches, idx) =>
                    matches.includes(shelf.id) ? idx + 1 : null
                  )
                  .filter((ord) => ord !== null);

                const isActive = activeOrders.length > 0;
                const primaryOrder = isActive ? activeOrders[0] : null;

                // Highlight colours per order (match badge colours)
                let highlightStyles = {};
                if (primaryOrder === 1) {
                  highlightStyles = {
                    background: "rgba(250, 204, 21, 0.18)",
                    borderColor: "rgba(250, 204, 21, 0.9)",
                    boxShadow: "0 0 10px rgba(250, 204, 21, 0.9)",
                  };
                } else if (primaryOrder === 2) {
                  highlightStyles = {
                    background: "rgba(74, 222, 128, 0.18)",
                    borderColor: "rgba(74, 222, 128, 0.9)",
                    boxShadow: "0 0 10px rgba(74, 222, 128, 0.9)",
                  };
                } else if (primaryOrder === 3) {
                  highlightStyles = {
                    background: "rgba(96, 165, 250, 0.18)",
                    borderColor: "rgba(96, 165, 250, 0.9)",
                    boxShadow: "0 0 10px rgba(96, 165, 250, 0.9)",
                  };
                } else if (primaryOrder === 4) {
                  highlightStyles = {
                    background: "rgba(244, 114, 182, 0.18)",
                    borderColor: "rgba(244, 114, 182, 0.9)",
                    boxShadow: "0 0 10px rgba(244, 114, 182, 0.9)",
                  };
                }

                return (
                  <div
                    key={shelf.id}
                    className={`bookshelf ${isActive ? "active" : ""}`}
                    style={{
                      left: `${shelf.xPercent}%`,
                      top: `${shelf.yPercent}%`,
                      width: `${shelf.widthPercent}%`,
                      height: `${shelf.heightPercent}%`,
                      ...highlightStyles,
                    }}
                  >
                    <div className="order-badges">
                      {activeOrders.map((ord) => (
                        <div
                          key={ord}
                          className={`order-badge order-${ord}`}
                        >
                          {ord}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="map-legend">
              <p style={{ margin: 0 }}>
                Shelves are dim by default. When a riddle matches, the shelf
                area highlights and shows that riddle&apos;s number. If multiple
                shelves share a number, narrow your keywords until only one
                remains. Credits to xMiho and GreenCarrot for the tip that
                bookshelves can be clicked in any order.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid #333",
              fontSize: "0.8rem",
              opacity: 0.85,
              textAlign: "center",
            }}
          >
            Made with love for{" "}
            <a
              href="https://maplelegends.com/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#9ad1ff", textDecoration: "underline" }}
            >
              MapleLegends
            </a>
            , but not affiliated. For feedback, please DM thsscapi on{" "}
            <a
              href="https://forum.maplelegends.com/index.php?conversations/add&to=thsscapi"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#9ad1ff", textDecoration: "underline" }}
            >
              ML forums
            </a>
            .
          </div>
        </div>
      </div>
    </>
  );
}
