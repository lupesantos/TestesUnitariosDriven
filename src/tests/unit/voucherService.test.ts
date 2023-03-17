import voucherService from "../../services/voucherService";
import { jest} from "@jest/globals"
import voucherRepository from "repositories/voucherRepository";

describe("voucher unit test suite", () => {
    it("should create a discount", async () =>{
        
        const data = {
            code: "a1b2c3",
            discount: 50,
        }

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any =>{
            return undefined;
        })
        

        jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any =>{
            return {
                 code: "a1b2c3",
                 discount: 50
            }
        })

    const result = await voucherService.createVoucher(data.code, data.discount)

    expect(result).toEqual({code: "a1b2c3", discount: 50})
    })

    it("Voucher code should be unique", async () =>{
        
        const data = {
            code: "a1b2c3",
            discount: 50,
        }

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any =>{
            return {
                code: "a1b2c3"
            };
        })

        const promise = voucherService.createVoucher(data.code, data.discount)

        expect(promise).rejects.toEqual({
            message: "Voucher already exist.",
            type: "conflict"
        })
    })

    it("Vouchers should be used only once", async () =>{
        
        const data = {
            code: "a1b2c3",
            discount: 50,
        }

        let amount = 200;

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any =>{
            return {
                code: "a1b2c3",
                discount: 50,
                used: true
            };
        })

        const result = await voucherService.applyVoucher(data.code, amount)

        expect(result.applied).toBe(false);
    })

    it("minimum amount should be at least 100", async () =>{
        
        const data = {
            code: "a1b2c3",
            discount: 50,
        }

        let amount = 90;

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any =>{
            return {
                code: "a1b2c3",
                discount: 50,
                used: false
            };
        })

        jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any =>{
            return {
                code: "a1b2c3",
                discount: 50,
                used: true
            };
        })

        const result = await voucherService.applyVoucher(data.code, amount)

        expect(result.applied).toBe(false);
        
    })

    it("should return amount, discount, finalAmount and apllied in case of successful applied voucher", async () =>{
        
        const data = {
            code: "a1b2c3",
            discount: 50,
        }

        let amount = 200;

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any =>{
            return {
                code: "a1b2c3",
                discount: 50,
                used: false
            };
        })

        jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any =>{
            return {
                code: "a1b2c3",
                discount: 50,
                used: true
            };
        })

        const result = await voucherService.applyVoucher(data.code, amount)

        expect(result).toEqual({
            amount: 200,
            applied: true,
            discount: 50,
            finalAmount: 100,
        });
        
    })
})


