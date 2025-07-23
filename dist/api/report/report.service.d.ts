import { AgentLedgerModel, AdminExpenseModel, AdminLedger, UpdateAdminLedgerDto } from './report.model';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
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
    addAdminExpsense(header: any, adminExpenseModel: AdminExpenseModel): Promise<AdminExpenseModel>;
    addAdminLedger(header: any, adminLedgerModel: AdminLedger): Promise<void>;
    editAdminLedger(header: any, id: number, updateAdminLedgerDto: UpdateAdminLedgerDto): Promise<void>;
    editAgentLedgerByAdmin(header: any, id: number, updateAgentBalanceUpdate: AgentBalanceUpdate): Promise<void>;
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
        AgentData: AgentModel[];
        SearchData: SearchHistoryModel[];
        TotalAgent: number;
        TotalBookingData: BookingModel[];
        TotalBooking: number;
        Cancelled: number;
        Ticketed: number;
        TotalDepositAmount: any;
        TotalDepositData: DepositModel[];
        TotalDeposit: number;
        TotalDepositApproved: number;
        TotalDepositPending: number;
        TotalDepositRejected: number;
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
    findAllAdminLedger(header: any, startDate: Date, endDate: Date): Promise<{
        lossProfit: any;
        ledger: any[];
        deespoit: any[];
        totalExpense: any;
        totalIncome: number;
        totalSell: any;
        totalTicketCost: any;
        totalDeposit: any;
    }>;
    findSingleAgentLedgerAdmin(header: any, agentId: string): Promise<{
        totalSell: any;
        totalDeposit: any;
        lastBalance: any;
    }>;
    findAllAdminBalanceInquery(header: any): Promise<any>;
}
