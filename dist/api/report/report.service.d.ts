import { AgentLedgerModel, AdminExpenseModel, AdminLedger, UpdateAdminLedgerDto, UpdateAdminExpenseDto } from './report.model';
import { Repository, DataSource } from 'typeorm';
import { AgentBalanceUpdate, AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { DepositModel } from '../deposit/deposit.model';
import { AuthService } from '../auth/auth.service';
import { SearchHistoryModel } from '../searchhistory/searchhistory.model';
export declare class ReportService {
    private readonly ledgerRepository;
    private readonly bookingRepository;
    private readonly agentRepository;
    private readonly depositRepository;
    private readonly searchHistoryRepository;
    private readonly adminExpenseRepository;
    private readonly adminLedgerRepository;
    private readonly authService;
    private dataSource;
    constructor(ledgerRepository: Repository<AgentLedgerModel>, bookingRepository: Repository<BookingModel>, agentRepository: Repository<AgentModel>, depositRepository: Repository<DepositModel>, searchHistoryRepository: Repository<SearchHistoryModel>, adminExpenseRepository: Repository<AdminExpenseModel>, adminLedgerRepository: Repository<AdminLedger>, authService: AuthService, dataSource: DataSource);
    adminGraph(header: any): Promise<{
        month: string;
        bookingCount: number;
        agentCount: number;
        cumulativeBooking: number;
        cumulativeAgent: number;
    }[]>;
    addAdminExpense(header: any, adminExpenseModel: AdminExpenseModel): Promise<AdminExpenseModel>;
    editAdminExpense(header: any, id: number, UpdateAdminExpenseDto: UpdateAdminExpenseDto): Promise<import("typeorm").UpdateResult>;
    addAdminLedger(header: any, adminLedgerModel: AdminLedger): Promise<void>;
    editAdminLedger(header: any, id: number, updateAdminLedgerDto: UpdateAdminLedgerDto): Promise<void>;
    deleteAdminLedger(header: any, id: number): Promise<import("typeorm").DeleteResult>;
    editAgentLedgerByAdmin(header: any, id: number, updateAgentBalanceUpdate: AgentBalanceUpdate): Promise<import("typeorm").UpdateResult>;
    deleteAgentLedgerByAdmin(header: any, uid: string): Promise<import("typeorm").DeleteResult>;
    findAllReportAdmin(header: any, startDate: Date, endDate: Date): Promise<{
        name: string;
        value: any;
    }[]>;
    findAllByAgentId(header: any, filter: string): Promise<{
        depositCount: any;
        depositAmount: any;
        refundCount: any;
        refundAmount: any;
        reissueCount: any;
        reissueAmount: any;
        ticketCount: any;
        ticketAmount: any;
        voidCount: any;
        voidAmount: any;
        data: any;
    }>;
    findDashboardAgent(header: any): Promise<{
        todaybooking: number;
        todayticketed: number;
        todaysearch: number;
        todaysell: any;
        todaydeposit: any;
        totalsell: any;
        totaldeposit: any;
    }>;
    findAllByDateRangeAgentId(header: any, startDate: Date, endDate: Date): Promise<{
        lossProfit: any;
        ledger: any;
        totalExpense: any;
        totalIncome: any;
    }>;
    findDashboard(header: any): Promise<{
        TotalFlightBooking: number;
        TotalHold: number;
        TotalTicketed: number;
        TotalVoid: number;
        TotalRefund: number;
        TotalReissue: number;
        TotalAgents: number;
        TotalBookingData: BookingModel[];
        GraphData: {
            month: string;
            bookingCount: number;
            agentCount: number;
            cumulativeBooking: number;
            cumulativeAgent: number;
        }[];
    }>;
    findAdminExpense(header: any, page: number, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: AdminExpenseModel[];
    }>;
    findAllAgentSingelAdmin(header: any, agentId: string, page: number, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: AgentLedgerModel[];
    }>;
    findAllAdminLedger(header: any, startDate: Date, endDate: Date, adminId: string): Promise<{
        lossProfit: number;
        ledger: any[];
        depsoit: any[];
        totalExpense: any;
        totalIncome: number;
        totalSell: any;
        totalTicketCost: any;
        totalDeposit: any;
    }>;
    findSingleAgentLedgerAdmin(header: any, agentId: string): Promise<{
        totalSell: any;
        totalDeposit: any;
        lastBalance: number;
    }>;
    findAllAdminBalanceInquery(header: any): Promise<any>;
}
