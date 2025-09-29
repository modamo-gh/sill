import { createContext, ReactNode, useContext, useState } from "react";

type MilesContextType = {
    miles: number;
    setMiles: React.Dispatch<React.SetStateAction<number>>;
};
const MilesContext = createContext<MilesContextType | undefined>(undefined);

export const MilesProvider = ({
    children,
    initialValue = 1,
}: {
    children: ReactNode;
    initialValue?: 1;
}) => {
    const [miles, setMiles] = useState(1);

    return <MilesContext.Provider value={{ miles, setMiles }}>{children}</MilesContext.Provider>;
};

export const useMiles = (): MilesContextType => {
    const context = useContext(MilesContext);

    if (!context) {
        throw new Error("useMiles must be used within a MilesProvider");
    }

    return context;
};
