import * as React from "react";

import { Currency, CurrencyIcon, TokenIcon } from "@renproject/react-components";
import BigNumber from "bignumber.js";
import { OrderedMap } from "immutable";

import { DarknodeFeeStatus } from "../../../../lib/ethereum/contractReads";
import { AllTokenDetails, OldToken, Token } from "../../../../lib/ethereum/tokens";
import { classNames } from "../../../../lib/react/className";
import { DarknodesState, NetworkStateContainer } from "../../../../store/networkStateContainer";
import { ReactComponent as RewardsIcon } from "../../../../styles/images/icon-rewards-white.svg";
// import { ReactComponent as WithdrawIcon } from "../../../../styles/images/icon-withdraw.svg";
import { Tabs } from "../../../common/Tabs";
import { TokenBalance } from "../../../common/TokenBalance";
import { FeesItem } from "../FeesItem";
import { Block, BlockBody, BlockTitle } from "./Block";

enum Tab {
    Withdrawable = "Withdrawable",
    Pending = "Pending",
}

const mergeFees = (left: OrderedMap<Token | OldToken, BigNumber>, right: OrderedMap<Token | OldToken, BigNumber>) => {
    let newFees = OrderedMap<Token | OldToken, BigNumber>();
    for (const token of left.keySeq().concat(right.keySeq()).toArray()) {
        newFees = newFees.set(token, new BigNumber(0).plus(left.get(token, new BigNumber(0)).plus(right.get(token, new BigNumber(0)))));
    }
    return newFees;
};

interface RowProps {
    token: Token | OldToken;
    isOperator: boolean;
    darknodeDetails: DarknodesState;
    tab: Tab;
    percent: number;
    balance: BigNumber;
    quoteCurrency: Currency;
}

export const FeesBlockRow: React.FC<RowProps> = ({ token, quoteCurrency, balance, isOperator, tab, percent, darknodeDetails }) => {
    return <>
        <tr style={{}}>
            <td className="fees-block--table--token">
                <TokenIcon className="fees-block--table--icon" white={true} token={token} />
                {" "}
                <span>{token}</span>
            </td>
            <td className="fees-block--table--value">
                <TokenBalance token={token} amount={balance} />
            </td>
            <td className="fees-block--table--usd">
                <CurrencyIcon currency={quoteCurrency} />
                <TokenBalance
                    token={token}
                    amount={balance}
                    convertTo={quoteCurrency}
                />
                {" "}
                <span className="fees-block--table--usd-symbol">
                    {quoteCurrency.toUpperCase()}
                </span>
            </td>
            {tab === Tab.Withdrawable && isOperator ? <td>
                <FeesItem
                    disabled={tab !== Tab.Withdrawable}
                    token={token}
                    amount={balance}
                    darknodeID={darknodeDetails.ID}
                />
            </td> : <></>}
        </tr>
        <tr>
            <td colSpan={3} style={{ padding: 0, margin: 0, height: 4 }}>
                <div className={classNames("percent-bar", token)} style={{ width: `${percent}%`, height: 4, marginTop: -6 }} />
            </td>
        </tr>
    </>;
};

export const FeesBlock: React.StatelessComponent<Props> = ({ darknodeDetails, isOperator }) => {

    const { quoteCurrency, currentCycle, previousCycle, pendingRewards, pendingTotalInEth, tokenPrices } = NetworkStateContainer.useContainer();

    const [tab, setTab] = React.useState(Tab.Withdrawable);
    const [disableClaim, setDisableClaim] = React.useState(false);

    const [currentCycleStatus, setCurrentCycleStatus] = React.useState<string | null>(null);

    const cycleStatus: string | null = React.useMemo(() => darknodeDetails && darknodeDetails.cycleStatus.keySeq().first(), [darknodeDetails]);

    React.useEffect(() => {
        setCurrentCycleStatus(cycleStatus);
        if (disableClaim && cycleStatus !== currentCycleStatus) {
            setDisableClaim(false);
        }
    }, [cycleStatus]);

    const showPreviousPending = darknodeDetails && darknodeDetails.cycleStatus.get(previousCycle) === DarknodeFeeStatus.NOT_CLAIMED;
    const showCurrentPending = darknodeDetails && darknodeDetails.cycleStatus.get(currentCycle) === DarknodeFeeStatus.NOT_CLAIMED;
    let pendingTotal = new BigNumber(0);
    let summedPendingRewards = OrderedMap<Token | OldToken, BigNumber>();
    let summedClaimable = new BigNumber(0);
    if (showPreviousPending) {
        pendingTotal = pendingTotal.plus(pendingTotalInEth.get(previousCycle, new BigNumber(0)));
        summedPendingRewards = pendingRewards.get(previousCycle, OrderedMap());
        summedClaimable = pendingTotal;
    }
    if (showCurrentPending) {
        pendingTotal = pendingTotal.plus(pendingTotalInEth.get(currentCycle, new BigNumber(0)));
        summedPendingRewards = pendingRewards.get(currentCycle, OrderedMap());
    }
    if (showPreviousPending && showCurrentPending) {
        summedPendingRewards = mergeFees(
            pendingRewards.get(previousCycle, OrderedMap()),
            pendingRewards.get(currentCycle, OrderedMap())
        );
    }

    let fees = OrderedMap<Token | OldToken, BigNumber>();
    if (darknodeDetails) {
        fees = tab === Tab.Withdrawable ? darknodeDetails.feesEarned :
            tab === Tab.Pending ? summedPendingRewards :
                mergeFees(
                    summedPendingRewards,
                    darknodeDetails.feesEarned
                );
    }

    const onTab = React.useCallback((newTab: string) => {
        setTab(newTab as Tab);
    }, [setTab]);

    return (
        <Block
            className="fees-block"
        >
            <BlockTitle>
                <h3>
                    <RewardsIcon />
                    Darknode Income
                    </h3>
            </BlockTitle>

            {darknodeDetails ? <BlockBody>
                <Tabs
                    tabs={{
                        Withdrawable: <></>,
                        Pending: <></>,
                    }}
                    onTab={onTab}
                >
                    <div className="block--advanced">
                        <div className="block--advanced--top">
                            <div className="fees-block--total">
                                <span className="fees-block--advanced--sign">
                                    <CurrencyIcon currency={quoteCurrency} />
                                </span>
                                <span className="fees-block--advanced--value">
                                    <TokenBalance
                                        token={Token.ETH}
                                        convertTo={quoteCurrency}
                                        amount={
                                            tab === Tab.Withdrawable ? darknodeDetails.feesEarnedTotalEth :
                                                pendingTotal
                                        }
                                    />
                                </span>
                                <span className="fees-block--advanced--unit">{quoteCurrency.toUpperCase()}</span>
                            </div>
                            {/* <button className="button button--dark"><WithdrawIcon className="icon" />Withdraw</button> */}
                        </div>
                        <div className="block--advanced--bottom">
                            <table className="fees-block--table">
                                <thead>
                                    <tr>
                                        <td>Asset</td>
                                        <td>Amount</td>
                                        <td style={{ textAlign: "right", paddingRight: 40 }}>Value</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        fees.map((balance, token) => ({
                                            // tslint:disable-next-line: no-non-null-assertion
                                            balance, percent: balance
                                                .div(new BigNumber(10).exponentiatedBy(AllTokenDetails.get(token, { decimals: 0 }).decimals))
                                                .times(tokenPrices?.get(token)?.get(Currency.ETH) || 0)
                                                .times(new BigNumber(10).exponentiatedBy(18))
                                                .div(tab === Tab.Withdrawable ? darknodeDetails.feesEarnedTotalEth : pendingTotal)
                                                .times(100)
                                                .decimalPlaces(2)
                                                .toNumber() || 0,
                                        })).sortBy(item => -item.percent).toArray().map(([token, { balance, percent }]: [Token | OldToken, { balance: BigNumber, percent: number }], i) => {
                                            return <FeesBlockRow
                                                key={token}
                                                token={token}
                                                isOperator={isOperator}
                                                darknodeDetails={darknodeDetails}
                                                tab={tab}
                                                percent={percent}
                                                balance={balance}
                                                quoteCurrency={quoteCurrency}
                                            />;
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Tabs>
            </BlockBody> : null}
        </Block>
    );
};

interface Props {
    isOperator: boolean;
    darknodeDetails: DarknodesState | null;
}
