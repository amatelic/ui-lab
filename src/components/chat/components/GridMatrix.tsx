import React, { useEffect, useRef } from "react";

export const GridMatrix = ({
  gridSize = 15,
  speed = 500,
  updatePercentage = 0.07,
}) => {
  const canvasRef = useRef(null);
  const gridRef = useRef(
    Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill("")),
  );

  // Function to generate a random character
  const getRandomChar = (approach = "weighted") => {
    switch (approach) {
      case "uniform":
        const randomType = Math.floor(Math.random() * 3);
        if (randomType === 0) return Math.floor(Math.random() * 10).toString();
        else if (randomType === 1)
          return String.fromCharCode(65 + Math.floor(Math.random() * 26));
        else
          return ["!", "@", "#", "$", "%", "^", "&", "*", "?"][
            Math.floor(Math.random() * 9)
          ];
      case "weighted":
        const weightedRandom = Math.random();
        if (weightedRandom < 0.7)
          return Math.floor(Math.random() * 10).toString();
        else if (weightedRandom < 0.9)
          return String.fromCharCode(65 + Math.floor(Math.random() * 26));
        else
          return ["!", "@", "#", "$", "%", "^", "&", "*", "?"][
            Math.floor(Math.random() * 9)
          ];
      case "pattern":
        return Math.random() > 0.5
          ? Math.floor(Math.random() * 10).toString()
          : " ";
      default:
        return Math.floor(Math.random() * 10).toString();
    }
  };

  // Function to draw the grid
  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cellSize = canvas.width / gridSize;

    // Clear the entire canvas
    ctx.fillStyle = "#08090a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the current grid
    ctx.font = `bold ${cellSize * 0.8}px 'Courier New', monospace`;
    ctx.fillStyle = "#5f6062";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = true;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = j * cellSize + cellSize / 2;
        const y = i * cellSize + cellSize / 2;
        ctx.fillText(gridRef.current[i][j], x, y);
      }
    }
  };

  // Function to update a random subset of cells
  const updateRandomCells = () => {
    const totalCells = gridSize * gridSize;
    const cellsToUpdate = Math.floor(totalCells * updatePercentage);

    for (let k = 0; k < cellsToUpdate; k++) {
      const i = Math.floor(Math.random() * gridSize);
      const j = Math.floor(Math.random() * gridSize);
      gridRef.current[i][j] = getRandomChar("weighted");
    }
  };

  // Initialize grid with random values
  useEffect(() => {
    const newGrid = Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(""));
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        newGrid[i][j] = getRandomChar("weighted");
      }
    }
    gridRef.current = newGrid;
    drawGrid();
  }, [gridSize]);

  // Animation loop
  useEffect(() => {
    let lastUpdate = 0;
    let frameId;

    const updateGrid = (timestamp) => {
      if (timestamp - lastUpdate >= speed) {
        updateRandomCells();
        drawGrid();
        lastUpdate = timestamp;
      }
      frameId = requestAnimationFrame(updateGrid);
    };

    frameId = requestAnimationFrame(updateGrid);

    return () => cancelAnimationFrame(frameId);
  }, [speed, updatePercentage]);

  return (
    <div
      style={{
        backgroundColor: "#08090a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
        width: "500px",
      }}
    >
      <canvas ref={canvasRef} width={500} height={500} />
    </div>
  );
};
