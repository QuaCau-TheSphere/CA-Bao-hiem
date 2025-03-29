import { HợpĐồngVậtThểPhí } from "../Code chính/Hợp đồng.ts";
import { KỳPhí } from "../Code chính/Vật thể phí.ts";

export interface ResBody {
  hợpĐồngVậtThểPhí: HợpĐồngVậtThểPhí;
  cácKỳPhíBịBỏ: KỳPhí[];
}
