import { ReportService } from './report.service';
import { AdminExpenseModel, AdminLedger, UpdateAdminLedgerDto } from './report.model';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    addExpsense(header: Headers, adminExpenseModel: AdminExpenseModel): Promise<AdminExpenseModel>;
    addAdminLedger(header: Headers, adminledgerModel: AdminLedger): Promise<void>;
    editAdminLedger(header: Headers, id: string, adminledgerDto: UpdateAdminLedgerDto): Promise<void>;
    findAllAdminLedger(header: string, startDate: Date, endDate: Date): Promise<{
        lossProfit: any;
        ledger: any[];
        totalExpense: any;
        totalIncome: number;
        totalSell: any;
        totalDeposit: any;
    }>;
    findSingleLedgerAdmin(header: string, agentId: string): Promise<{
        totalSell: any;
        totalDeposit: any;
        lastBalance: any;
    }>;
    findAllAdminBalance(header: string): Promise<any>;
    findAllReportAdmin(header: Headers, startDate: Date, endDate: Date): Promise<{
        name: string;
        value: any;
    }[]>;
    findAllByAgentId(header: string, filter: string): Promise<{
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
    findAllBydate(header: string, startDate: Date, endDate: Date): Promise<{
        lossProfit: any;
        ledger: any;
        totalExpense: any;
        totalIncome: any;
    }>;
    findDashboard(header: Headers): Promise<{
        AgentData: import("../agent/agent.model").AgentModel[];
        SearchData: import("../searchhistory/searchhistory.model").SearchHistoryModel[];
        TotalAgent: number;
        TotalBookingData: import("../booking/booking.model").BookingModel[];
        TotalBooking: number;
        Cancelled: number;
        Ticketed: number;
        TotalDepositAmount: any;
        TotalDepositData: import("../deposit/deposit.model").DepositModel[];
        TotalDeposit: number;
        TotalDepositApproved: number;
        TotalDepositPending: number;
        TotalDepositRejected: number;
    }>;
    findDashboardAgent(header: string): Promise<{
        todaybooking: number;
        todayticketed: number;
        todaysearch: number;
        todaysell: any;
        todaydeposit: any;
        totalsell: any;
        totaldeposit: any;
    }>;
    findAdminExpense(header: Headers, page?: number, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: AdminExpenseModel[];
    }>;
}
