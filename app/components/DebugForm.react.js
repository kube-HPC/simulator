import { Form, Input, Icon, AutoComplete } from 'antd';
const FormItem = Form.Item;
const DebugForm = (onFormDataChange) =>
    <Form style={{ height: "300px", width: "400px" }} className="login-form">
        <FormItem>
        <AutoComplete>
            <Input prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Pipeline" />
            </AutoComplete>
        </FormItem>
        <FormItem>
        <AutoComplete>
            <Input prefix={<Icon type="api" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="NodeName" />
            </AutoComplete>
        
        </FormItem>
        <FormItem>
            <AutoComplete>
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(100,100,0,.75)' }} />}  placeholder="BatchNumber" />
    </AutoComplete>
        </FormItem>



    </Form>

export default DebugForm