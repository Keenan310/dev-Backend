import { AgentLedgerModel, AdminExpenseModel } from './report.model';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { AgentModel } from '../agent/agent.model';
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
    private readonly authService;
    private dataSource;
    constructor(ledgerRepository: Repository<AgentLedgerModel>, bookingRepository: Repository<BookingModel>, agentRepository: Repository<AgentModel>, depositRepository: Repository<DepositModel>, searchHistoryRepository: Repository<SearchHistoryModel>, adminExpenseRepository: Repository<AdminExpenseModel>, authService: AuthService, dataSource: DataSource);
    addAdminExpsense(header: any, adminExpenseModel: AdminExpenseModel): Promise<AdminExpenseModel>;
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
    findAllLedger(header: any, page: number, type: string, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        report: {
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
        };
        data: AgentLedgerModel[];
    }>;
    findAdminExpense(header: any, page: number, filter: string, limit: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: AdminExpenseModel[];
    }>;
    findAllAdminLedger(header: any, startDate: Date, endDate: Date): Promise<{
        lossProfit: any;
        ledger: any;
        totalExpense: any;
        totalIncome: any;
        totalSell: any;
        totaldeposit: any;
    }>;
}
