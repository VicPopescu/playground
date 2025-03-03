"use client";

import { useState, useEffect } from "react";
import { SymbolData } from "@/lib/api/hooks/get/useFetchSymbols";
import StockSearch from "@/features/stock-search";
import StockTable from "@/features/stock-table";
import StockHistoricalDataAggregator from "@/features/stock-historical-data-aggregator";
import { Box, Stack } from "@mui/material";
import StockAggregatedSentiment from "@/features/stock-aggregated-sentiment";

const PortfolioBuilder = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [addedStocks, setAddedStocks] = useState<SymbolData[]>([]);

  const handleOptionSelect = (option: SymbolData) => {
    setAddedStocks((prevOptions) => {
      if (prevOptions.some((stock) => stock.symbol === option.symbol)) {
        return prevOptions;
      }
      return [...prevOptions, option];
    });
  };

  const handleDelete = (symbol: string) => {
    setAddedStocks((prevStocks) =>
      prevStocks.filter((stock) => stock.symbol !== symbol)
    );
  };

  const handleDeleteAll = () => {
    setAddedStocks([]);
  };

  useEffect(() => {
    const storedStocks = localStorage.getItem("addedStocks");
    if (storedStocks) {
      setAddedStocks(JSON.parse(storedStocks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("addedStocks", JSON.stringify(addedStocks));
  }, [addedStocks]);

  return (
    <>
      <StockSearch onOptionSelect={handleOptionSelect} />
      <StockTable
        data={addedStocks}
        setSelectedSymbols={setSelectedSymbols}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
      />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ width: "100%", height: "100%" }}
      >
        <Box sx={{ flex: 1 }}>
          <StockHistoricalDataAggregator selectedSymbols={selectedSymbols} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StockAggregatedSentiment selectedSymbols={selectedSymbols} />
        </Box>
      </Stack>
    </>
  );
};

export default PortfolioBuilder;
