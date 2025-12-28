import { ReportService } from './report.service';
import { AdminExpenseModel, AdminLedger, UpdateAdminLedgerDto } from './report.model';
import { AgentBalanceUpdate } from '../agent/agent.model';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    addGraph(header: Headers): Promise<{
        month: string;
        bookingCount: number;
        agentCount: number;
        cumulativeBooking: number;
        cumulativeAgent: number;
    }[]>;
    addExpense(header: Headers, adminExpenseModel: AdminExpenseModel): Promise<AdminExpenseModel>;
    editExpense(header: Headers, id: string, adminExpenseModel: AdminExpenseModel): Promise<import("typeorm").UpdateResult>;
    addAdminLedger(header: Headers, adminledgerModel: AdminLedger): Promise<void>;
    editAdminLedger(header: Headers, id: string, adminLedgerDto: UpdateAdminLedgerDto): Promise<void>;
    deleteAdminLedger(header: Headers, id: string): Promise<import("typeorm").DeleteResult>;
    editAgentLedgerByAdmin(header: Headers, id: string, updateAgentLedgerDto: AgentBalanceUpdate): Promise<import("typeorm").UpdateResult>;
    deleteAgentLedgerByAdmin(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
    findAllAdminLedger(header: string, startDate: Date, endDate: Date, adminId: string): Promise<{
        lossProfit: number;
        ledger: any[];
        depsoit: any[];
        totalExpense: any;
        totalIncome: number;
        totalSell: any;
        totalTicketCost: any;
        totalDeposit: any;
    }>;
    findSingleLedgerAdmin(header: string, agentId: string): Promise<{
        totalSell: any;
        totalDeposit: any;
        lastBalance: number;
    }>;
    findAgentSingelAllLedger(header: Headers, agentId?: string, page?: number, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: import("./report.model").AgentLedgerModel[];
    }>;
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
        TotalFlightBooking: number;
        TotalHold: number;
        TotalTicketed: number;
        TotalVoid: number;
        TotalRefund: number;
        TotalReissue: number;
        TotalAgents: number;
        TotalBookingData: import("../booking/booking.model").BookingModel[];
        GraphData: {
            month: string;
            bookingCount: number;
            agentCount: number;
            cumulativeBooking: number;
            cumulativeAgent: number;
        }[];
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
