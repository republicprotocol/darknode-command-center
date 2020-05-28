/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { Contract, ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import { ContractEvent, Callback, TransactionObject, BlockType } from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export class DarknodePayment extends Contract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  );
  clone(): DarknodePayment;
  address: string;
  methods: {
    ETHEREUM(): TransactionObject<string>;

    VERSION(): TransactionObject<string>;

    changeCycle(): TransactionObject<string>;

    claim(_darknode: string): TransactionObject<void>;

    claimOwnership(): TransactionObject<void>;

    claimStoreOwnership(): TransactionObject<void>;

    currentCycle(): TransactionObject<string>;

    currentCyclePayoutPercent(): TransactionObject<string>;

    currentCycleRewardPool(_token: string): TransactionObject<string>;

    cycleChanger(): TransactionObject<string>;

    cycleStartTime(): TransactionObject<string>;

    darknodeBalances(
      _darknodeID: string,
      _token: string
    ): TransactionObject<string>;

    darknodeRegistry(): TransactionObject<string>;

    deposit(_value: number | string, _token: string): TransactionObject<void>;

    deregisterToken(_token: string): TransactionObject<void>;

    forward(_token: string): TransactionObject<void>;

    initialize(_nextOwner: string): TransactionObject<void>;

    isOwner(): TransactionObject<boolean>;

    nextCyclePayoutPercent(): TransactionObject<string>;

    owner(): TransactionObject<string>;

    pendingOwner(): TransactionObject<string>;

    pendingTokens(arg0: number | string): TransactionObject<string>;

    previousCycle(): TransactionObject<string>;

    previousCycleRewardShare(arg0: string): TransactionObject<string>;

    registerToken(_token: string): TransactionObject<void>;

    registeredTokenIndex(arg0: string): TransactionObject<string>;

    registeredTokens(arg0: number | string): TransactionObject<string>;

    renounceOwnership(): TransactionObject<void>;

    rewardClaimed(
      arg0: string,
      arg1: number | string
    ): TransactionObject<boolean>;

    store(): TransactionObject<string>;

    tokenPendingRegistration(_token: string): TransactionObject<boolean>;

    transferOwnership(newOwner: string): TransactionObject<void>;

    transferStoreOwnership(_newOwner: string): TransactionObject<void>;

    unclaimedRewards(arg0: string): TransactionObject<string>;

    updateCycleChanger(_addr: string): TransactionObject<void>;

    updateDarknodeRegistry(_darknodeRegistry: string): TransactionObject<void>;

    updatePayoutPercentage(_percent: number | string): TransactionObject<void>;

    withdraw(_darknode: string, _token: string): TransactionObject<void>;

    withdrawMultiple(
      _darknodes: string[],
      _tokens: string[]
    ): TransactionObject<void>;
  };
  events: {
    LogCycleChangerChanged: ContractEvent<{
      _newCycleChanger: string;
      _oldCycleChanger: string;
      0: string;
      1: string;
    }>;
    LogDarknodeClaim: ContractEvent<{
      _darknode: string;
      _cycle: string;
      0: string;
      1: string;
    }>;
    LogDarknodeRegistryUpdated: ContractEvent<{
      _previousDarknodeRegistry: string;
      _nextDarknodeRegistry: string;
      0: string;
      1: string;
    }>;
    LogDarknodeWithdrew: ContractEvent<{
      _darknodeOperator: string;
      _darknodeID: string;
      _token: string;
      _value: string;
      0: string;
      1: string;
      2: string;
      3: string;
    }>;
    LogPaymentReceived: ContractEvent<{
      _payer: string;
      _token: string;
      _amount: string;
      0: string;
      1: string;
      2: string;
    }>;
    LogPayoutPercentChanged: ContractEvent<{
      _newPercent: string;
      _oldPercent: string;
      0: string;
      1: string;
    }>;
    LogTokenDeregistered: ContractEvent<string>;
    LogTokenRegistered: ContractEvent<string>;
    OwnershipTransferred: ContractEvent<{
      previousOwner: string;
      newOwner: string;
      0: string;
      1: string;
    }>;
    allEvents: (
      options?: EventOptions,
      cb?: Callback<EventLog>
    ) => EventEmitter;
  };
}
