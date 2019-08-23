import { CurrencyIcon, Loading } from "@renproject/react-components";
import React from "react";
import { connect } from "react-redux";

import { Token } from "../../lib/ethereum/tokens";
import { ApplicationState } from "../../store/applicationState";
import { Change } from "../common/Change";
import { Stat, Stats } from "../common/Stat";
import { TokenBalance } from "../common/TokenBalance";
import { DarknodeMap } from "./darknodeMap/DarknodeMap";
import { MapContainer } from "./mapContainer";
import { RewardChart } from "./RewardChart";

const mapStateToProps = (state: ApplicationState) => ({
    currentCycle: state.network.currentCycle,
    previousCycle: state.network.previousCycle,
    pendingTotalInEth: state.network.pendingTotalInEth,
    quoteCurrency: state.network.quoteCurrency,
    currentShareCount: state.network.currentShareCount,
});

export const Overview = connect(mapStateToProps)(({
    currentCycle, previousCycle, pendingTotalInEth, quoteCurrency, currentShareCount
}: ReturnType<typeof mapStateToProps>) => {
    const container = MapContainer.useContainer();
    const numDarknodesNextEpoch = 0;
    const numDarknodes = 0;
    const current = pendingTotalInEth.get(currentCycle, undefined);
    const previous = pendingTotalInEth.get(previousCycle, undefined);
    const currentSummed = current ? current.times(currentShareCount) : undefined;
    const previousSummed = previous ? previous.times(currentShareCount) : undefined;

    return (
        <div className="overview container">
            <Stats>
                <Stat message="Darknodes online">
                    <Stats>
                        <Stat message="Registered" big>{numDarknodes}</Stat>
                        <Stat message="Online" big>
                            {container.darknodeCount === null ? <Loading alt /> : <>
                                {container.darknodeCount}
                                <Change className="stat--children--diff" change={container.darknodeCount - numDarknodes} />
                            </>}
                        </Stat>
                        <Stat message="Change next epoch" big>
                            <Change change={numDarknodesNextEpoch - numDarknodes} />
                        </Stat>
                        <Stat message="% Ren Registered" big>{100 * numDarknodes / 10000}%</Stat>
                    </Stats>
                </Stat>
                <Stat message="Total network rewards">
                    <Stats>
                        {/* <Stat message="All time total" big>$?</Stat> */}
                        <Stat message="Current cycle" big>
                            {currentSummed ? <>
                                <CurrencyIcon currency={quoteCurrency} />
                                <TokenBalance
                                    token={Token.ETH}
                                    convertTo={quoteCurrency}
                                    amount={currentSummed}
                                /></> : <Loading alt />}</Stat>
                        <Stat message="Last cycle" highlight big>
                            {previousSummed ? <><CurrencyIcon currency={quoteCurrency} /><TokenBalance
                                token={Token.ETH}
                                convertTo={quoteCurrency}
                                amount={previousSummed}
                            /></> : <Loading alt />}
                        </Stat>
                    </Stats>
                </Stat>
            </Stats>

            <div className="overview--bottom">
                <DarknodeMap />
                <RewardChart />
            </div>
        </div>
    );
});
