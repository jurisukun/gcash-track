import { Select, SelectItem, Text } from "@ui-kitten/components";
import { View } from "react-native";
import { useState } from "react";

export default function SortBy({ sortBy, setSortBy }) {
  const [selectedIndex, setSelectedIndex] = useState();

  const options = ["All", "Cash in", "Cash out", "Load", "Others"];

  const renderOption = (title) => <SelectItem key={title} title={title} />;

  return (
    <View className="scale-[0.85]">
      <Select
        placeholder={<Text>Sort by</Text>}
        selectedIndex={selectedIndex}
        style={{ width: 140 }}
        onSelect={(index) => {
          setSelectedIndex(index);
          setSortBy(options[index.row]);
        }}
        pla
        value={options[options.indexOf(sortBy)] || options[selectedIndex?.row]}
      >
        {options.map(renderOption)}
      </Select>
    </View>
  );
}
